import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import { io } from 'socket.io-client';
import msgpackParser from 'socket.io-msgpack-parser';

import AppBar from './components/AppBar';
import NavigationDrawer from './components/NavigationDrawer';
import ConnectionModal from './components/ConnectionModal';
import SocketHolder from './SocketHolder';
import theme from './plugins/theme';
import {
  selectConnectionState,
  saveConfig,
  saveSessionId,
  connect,
  disconnect
} from './store/modules/connection';
import { initializeConfig, updateConfig } from './store/modules/config';
import { onServerStats as onServersStats } from './store/modules/servers';

import { onAllSockets, onRoomJoined, onRoomLeft, onSocketConnected, onSocketDisconnected, onSocketUpdated, onServerStats as onMainServerStats, onEventReceived, onEventSent } from './store/modules/mainSlice'
import { useTranslation } from 'react-i18next';

// Views
import Dashboard from './views/Dashboard';
import Sockets from './views/Sockets';
import Socket from './views/Socket';
import Rooms from './views/Rooms';
import Clients from './views/Clients';
import Client from './views/Client';
import Servers from './views/Servers';
import Room from './views/Room';
import Events from './views/Events';

function AppContent() {
  const dispatch = useDispatch();
  const connection = useSelector(selectConnectionState);
  const darkTheme = useSelector(state => state.config.darkTheme);

  const [showConnectionModal, setShowConnectionModal] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [connectionError, setConnectionError] = React.useState('');

  useEffect(() => {
    // Initialize theme
    if (connection.serverUrl) {
      const sessionId = connection.sessionId;
      tryConnect(
        connection.serverUrl,
        connection.namespace,
        { sessionId },
        connection.wsOnly,
        connection.path,
        connection.parser
      );
    } else {
      setShowConnectionModal(true);
    }
  }, []);

  const tryConnect = (serverUrl, namespace, auth, wsOnly, path, parser) => {
    setIsConnecting(true);
    if (SocketHolder.socket) {
      SocketHolder.socket.disconnect();
      SocketHolder.socket.off('connect');
      SocketHolder.socket.off('connect_error');
      SocketHolder.socket.off('disconnect');
    }

    const socket = io(serverUrl + namespace, {
      forceNew: true,
      reconnection: false,
      withCredentials: true,
      transports: wsOnly ? ['websocket'] : ['polling', 'websocket'],
      path,
      parser: parser === 'msgpack' ? msgpackParser : undefined,
      auth,
    });

    socket.once('connect', () => {
      setShowConnectionModal(false);
      setConnectionError('');
      setIsConnecting(false);

      socket.io.reconnection(true);
      dispatch(saveConfig({ serverUrl, wsOnly, path, namespace, parser }));
      SocketHolder.socket = socket;
      registerEventListeners(socket);
    });

    socket.on('connect', () => {
      dispatch(connect());
    });

    socket.on('connect_error', (err) => {
      if (isConnecting || err.message === 'invalid credentials') {
        setShowConnectionModal(true);
        setConnectionError(err.message);
      }
      setIsConnecting(false);
    });

    socket.on('disconnect', (reason) => {
      if (isConnecting) {
        setIsConnecting(false);
        setConnectionError(reason);
      }
      dispatch(disconnect());
    });
  };

  const registerEventListeners = (socket) => {
    socket.on('session', (sessionId) => {
      dispatch(saveSessionId(sessionId));
    });

    socket.on('config', (config) => {
      dispatch(updateConfig(config));
    });

    socket.on('server_stats', (serverStats) => {
      dispatch(onServersStats(serverStats));
      dispatch(onMainServerStats({ serverStats }));
    });

    socket.on('all_sockets', (sockets) => {
      // console.log(sockets, 368)
      dispatch(onAllSockets({ sockets }));
    });

    socket.on('socket_connected', (socketData, timestamp = new Date().toISOString()) => {
      dispatch(onSocketConnected({ timestamp, socket: socketData }));
    });

    socket.on('socket_updated', (socketData) => {
      // console.log({ socket: socketData })
      dispatch(onSocketUpdated({ socket: socketData }));
    });

    socket.on('socket_disconnected', (nsp, id, reason, timestamp = new Date().toISOString()) => {
      // console.log({ timestamp, nsp, id, reason })
      dispatch(onSocketDisconnected({ timestamp, nsp, id, reason }));
    });

    socket.on('room_joined', (nsp, room, id, timestamp = new Date().toISOString()) => {
      dispatch(onRoomJoined({ timestamp, nsp, room, id }));
    });

    socket.on('room_left', (nsp, room, id, timestamp = new Date().toISOString()) => {
      dispatch(onRoomLeft({ timestamp, nsp, room, id }));
    });

    socket.on('event_received', (nsp, id, args, timestamp) => {
      dispatch(onEventReceived({ timestamp, nsp, id, args }));
    });

    socket.on('event_sent', (nsp, id, args, timestamp) => {
      dispatch(onEventSent({ timestamp, nsp, id, args }));
    });
  };

  const onSubmit = (form) => {
    tryConnect(
      form.serverUrl,
      form.namespace,
      {
        username: form.username,
        password: form.password,
      },
      form.wsOnly,
      form.path,
      form.parser
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', color: darkTheme ? '#121212' : '#f5f5f5' }}>
      <AppBar onUpdate={() => setShowConnectionModal(true)} />
      <NavigationDrawer />

      <main style={{
        flexGrow: 1,
        padding: '64px 0 0 0',
        backgroundColor: darkTheme ? '#121212' : '#f5f5f5'
      }}>
        <Container maxWidth={false} style={{ padding: '16px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sockets" element={<Sockets />} />
            <Route path="/n/:nsp/sockets/:id" element={<Socket />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/n/:nsp/rooms/:name" element={<Room />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<Client />} />
            <Route path="/events" element={<Events />} />
            <Route path="/servers" element={<Servers />} />
          </Routes>
        </Container>
      </main>

      <ConnectionModal
        isOpen={showConnectionModal}
        initialServerUrl={connection.serverUrl}
        initialWsOnly={connection.wsOnly}
        initialPath={connection.path}
        initialNamespace={connection.namespace}
        initialParser={connection.parser}
        isConnecting={isConnecting}
        error={connectionError}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}
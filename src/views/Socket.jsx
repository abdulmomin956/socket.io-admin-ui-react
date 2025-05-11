import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { Breadcrumbs, Link, Typography, Container, Grid2 } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SocketRooms from '../components/Socket/SocketRooms';
import SocketDetails from '../components/Socket/SocketDetails';
import InitialRequest from '../components/Socket/InitialRequest';
import { find } from 'lodash-es';

const Socket = () => {
    const { t } = useTranslation();
    const { nsp, id } = useParams();
    const navigate = useNavigate();

    // State for socket and client
    const [socket, setSocket] = useState(null);
    const [client, setClient] = useState(null);


    // Breadcrumb items
    const breadcrumbItems = [
        {
            text: t('sockets.title'),
            onClick: () => navigate('/sockets')
        },
        {
            text: t('sockets.details'),
            disabled: true
        }
    ];


    const socketData = useSelector(state => {
        const namespace = find(state.main.namespaces, { name: nsp });
        if (namespace) {
            return find(namespace.sockets, { id });
        }
    });

    const clientData = useSelector(state => {
        return find(state.main.clients, { id: socketData?.clientId });
    });

    useEffect(() => {
        if (socketData) {
            setSocket(socketData);
        }
        setClient(clientData || null);
    }, [socketData, clientData]);


    // if (!socket) {
    //     return <Typography variant="body1">Loading socket data...</Typography>;
    // }

    return (
        // socketData && socketData.connected &&
        <div>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                {breadcrumbItems.map((item, index) => (
                    item.disabled ? (
                        <Typography key={index} color="text.primary">
                            {item.text}
                        </Typography>
                    ) : (
                        <Link
                            key={index}
                            component="button"
                            onClick={item.onClick}
                            underline="hover"
                            color="inherit"
                        >
                            {item.text}
                        </Link>
                    )
                ))}
            </Breadcrumbs>

            {/* Main content */}
            {socketData && socketData.connected && client?.connected &&
                <Container maxWidth={false}>
                    <Grid2 container spacing={3}>
                        <Grid2 size={{ sx: 12, md: 6, lg: 4 }}>
                            <SocketDetails socket={socketData} client={client} />
                        </Grid2>

                        <Grid2 size={{ sx: 12, md: 6, lg: 4 }}>
                            <InitialRequest socket={socketData} />
                        </Grid2>

                        <Grid2 size={{ sx: 12, md: 6, lg: 4 }}>
                            <SocketRooms socket={socketData} nsp={nsp} />
                        </Grid2>
                    </Grid2>
                </Container>}
        </div>
    );
};

export default Socket;
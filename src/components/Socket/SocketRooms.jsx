import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { differenceBy, find } from 'lodash-es';
import {
    Card,
    CardHeader,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    TextField,
    Autocomplete,
    Button,
    Box
} from '@mui/material';
import {
    // TagOffOutlined as LeaveIcon,
    TagOutlined as JoinIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import SocketHolder from '../../SocketHolder';


const SocketRooms = ({ socket, nsp }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [newRoom, setNewRoom] = useState('');

    // Redux state
    //const state = useSelector(state => state)
    const isReadonly = useSelector(state => state.config.readonly);
    const isSocketLeaveSupported = useSelector(state =>
        state.config.supportedFeatures.includes('LEAVE')
    );
    const namespaces = useSelector(state => state.namespaces)
    const namespace = find(namespaces, { name: nsp })
    const roomsByNamespace = namespace ? namespace.rooms : [];

    // Table headers
    const headers = [
        { id: 'name', label: t('id'), align: 'left' },
        { id: 'actions', label: '', align: 'right' }
    ];

    // Process rooms data
    const roomsAsObjects = socket.rooms
        .slice(0)
        .sort()
        .map(room => ({ name: room }));

    const availableRooms = differenceBy(
        roomsByNamespace,
        roomsAsObjects,
        'name'
    );

    // Event handlers
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newRoom.trim()) {
            SocketHolder.socket.emit('join', socket.nsp, newRoom, socket.id);
            setNewRoom('');
        }
    };

    const handleLeave = (room) => {
        SocketHolder.socket.emit('leave', socket.nsp, room.name, socket.id);
    };

    const handleRowClick = (room) => {
        navigate(`/n/${encodeURIComponent(socket.nsp)}/rooms/${room.name}`);
    };

    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader title={t('rooms.title')} />

            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {headers.map(header => (
                                <TableCell key={header.id} align={header.align}>
                                    {header.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roomsAsObjects.map(room => (
                            <TableRow
                                key={room.name}
                                hover
                                onClick={() => handleRowClick(room)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell>{room.name}</TableCell>
                                <TableCell align="right">
                                    {isSocketLeaveSupported && (
                                        <Tooltip title={t('sockets.leave')}>
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLeave(room);
                                                }}
                                                disabled={isReadonly}
                                                size="small"
                                            >
                                                {/* <LeaveIcon /> */}
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <CardContent>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    <Autocomplete
                        freeSolo
                        options={availableRooms.map(room => room.name)}
                        value={newRoom}
                        onChange={(_, value) => setNewRoom(value || '')}
                        inputValue={newRoom}
                        onInputChange={(_, value) => setNewRoom(value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t('sockets.join-a-room')}
                                size="small"
                                sx={{ width: 200, mr: 2 }}
                                disabled={isReadonly}
                            />
                        )}
                        disabled={isReadonly}
                    />

                    <Tooltip title={t('sockets.join')}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="small"
                            disabled={isReadonly || !newRoom.trim()}
                            startIcon={<JoinIcon />}
                        >
                            {t('sockets.join')}
                        </Button>
                    </Tooltip>
                </Box>
            </CardContent>
        </Card>
    );
};

export default SocketRooms;
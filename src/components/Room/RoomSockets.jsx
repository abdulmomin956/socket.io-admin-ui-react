import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import {
    Card,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableFooter,
    TablePagination,
    IconButton,
    Tooltip,
    Box
} from '@mui/material';
import {
    Logout as DisconnectIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Transport from '../Transport';
import SocketHolder from '../../SocketHolder';
import Icon from '@mdi/react';
import { mdiTagOffOutline } from '@mdi/js';

const RoomSockets = ({ room }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { nsp } = useParams();

    // Local state for pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    // Redux state
    const isReadonly = useSelector(state => state.config.readonly);
    const isSocketLeaveSupported = useSelector(state =>
        state.config.supportedFeatures.includes('LEAVE')
    );
    const isSocketDisconnectSupported = useSelector(state =>
        state.config.supportedFeatures.includes('DISCONNECT')
    );

    // Table headers
    const headers = [
        { id: 'id', label: t('id'), align: 'left' },
        { id: 'address', label: t('sockets.address') },
        { id: 'transport', label: t('sockets.transport') },
        { id: 'actions', label: '', align: 'right' }
    ];

    // Event handlers
    const handleLeave = (socket) => {
        SocketHolder.socket.emit('leave', socket.nsp, room.name, socket.id);
    };

    const handleDisconnect = (socket) => {
        SocketHolder.socket.emit('_disconnect', socket.nsp, false, socket.id);
    };

    const handleRowClick = (socket) => {
        navigate(`/n/${encodeURIComponent(nsp)}/sockets/${socket.id}`);
    };

    if (!room) {
        return null;
    }

    return (
        <Card>
            <CardHeader title={t('sockets.title')} />

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headers.map(header => (
                                <TableCell key={header.id} align={header.align || 'left'}>
                                    {header.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {room.sockets
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map(socket => (
                                <TableRow
                                    key={socket.id}
                                    hover
                                    onClick={() => handleRowClick(socket)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell>{socket.id}</TableCell>
                                    <TableCell>{socket.handshake?.address}</TableCell>
                                    <TableCell>
                                        <Transport transport={socket.transport} />
                                    </TableCell>
                                    <TableCell align="right">
                                        {isSocketLeaveSupported && !room.isPrivate && (
                                            <Tooltip title={t('rooms.leave')}>
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleLeave(socket);
                                                    }}
                                                    disabled={isReadonly}
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                >
                                                    <Icon path={mdiTagOffOutline} size={1} />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {isSocketDisconnectSupported && (
                                            <Tooltip title={t('sockets.disconnect')}>
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDisconnect(socket);
                                                    }}
                                                    disabled={isReadonly}
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                >
                                                    <DisconnectIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>

                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[20, 100, { label: t('all'), value: -1 }]}
                                count={room.sockets.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={(_, newPage) => setPage(newPage)}
                                onRowsPerPageChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value, 10));
                                    setPage(0);
                                }}
                                labelRowsPerPage={t('rowsPerPage')}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Card>
    );
};

export default RoomSockets;
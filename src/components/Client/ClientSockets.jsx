import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
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
import { Logout as DisconnectIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import SocketHolder from '../../SocketHolder';

const ClientSockets = ({ sockets }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Local state for pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Redux state
    const isReadonly = useSelector(state => state.config.readonly);
    const isSocketDisconnectSupported = useSelector(state =>
        state.config.supportedFeatures.includes('DISCONNECT')
    );

    // Table headers
    const headers = [
        { id: 'id', label: '#', align: 'left' },
        { id: 'nsp', label: t('namespace') },
        { id: 'actions', label: '', align: 'right' }
    ];

    // Event handlers
    const handleDisconnect = (socket) => {
        SocketHolder.socket.emit('_disconnect', socket.nsp, false, socket.id);
    };

    const handleRowClick = (socket) => {
        navigate(`/n/${encodeURIComponent(socket.nsp)}/sockets/${socket.id}`);
    };

    return (
        <Card>
            <CardHeader title={t('sockets.title')} />

            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {headers.map(header => (
                                <TableCell
                                    key={header.id}
                                    align={header.align || 'left'}
                                >
                                    {header.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {sockets
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map(socket => (
                                <TableRow
                                    key={socket.id}
                                    hover
                                    onClick={() => handleRowClick(socket)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell>{socket.id}</TableCell>
                                    <TableCell>
                                        <Box component="code">{socket.nsp}</Box>
                                    </TableCell>
                                    <TableCell align="right">
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
                                rowsPerPageOptions={[10, 25, 50]}
                                count={sockets.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={(_, newPage) => setPage(newPage)}
                                onRowsPerPageChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value, 10));
                                    setPage(0);
                                }}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Card>
    );
};

export default ClientSockets;
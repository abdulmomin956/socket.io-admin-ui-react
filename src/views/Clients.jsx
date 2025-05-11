import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableFooter,
    TablePagination,
    Breadcrumbs,
    Typography,
    IconButton,
    Tooltip,
    Box
} from '@mui/material';
import { Logout as DisconnectIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Transport from '../components/Transport';
import SocketHolder from '../SocketHolder';

const Clients = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Local state for pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    // Redux state
    const clients = useSelector(state => state.main.clients);
    const isReadonly = useSelector(state => state.config.readonly);
    const isSocketDisconnectSupported = useSelector(state =>
        state.config.supportedFeatures.includes('DISCONNECT')
    );

    // Breadcrumb items
    const breadcrumbItems = [
        { text: t('clients.title'), disabled: true }
    ];

    // Table headers
    const headers = [
        { id: 'id', label: '#', align: 'left' },
        { id: 'address', label: t('sockets.address') },
        { id: 'transport', label: t('sockets.transport') },
        { id: 'sockets', label: t('clients.sockets-count') },
        { id: 'actions', label: '', align: 'right' }
    ];

    // Event handlers
    const handleDisconnect = (client) => {
        const socket = client.sockets[0];
        if (socket) {
            SocketHolder.socket.emit('_disconnect', socket.nsp, true, socket.id);
        }
    };

    const handleRowClick = (client) => {
        navigate(`/clients/${client.id}`);
    };

    return (
        <div>
            {/* Breadcrumbs */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                {breadcrumbItems.map((item, index) => (
                    <Typography key={index} color="textPrimary">
                        {item.text}
                    </Typography>
                ))}
            </Breadcrumbs>

            {/* Main card */}
            <Card>
                <TableContainer>
                    <Table>
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
                            {clients
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(client => (
                                    <TableRow
                                        key={client.id}
                                        hover
                                        onClick={() => handleRowClick(client)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>{client.id}</TableCell>
                                        <TableCell>
                                            {client.sockets.length > 0 && (
                                                <span>{client.sockets[0].handshake.address}</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {client.sockets.length > 0 && (
                                                <Transport transport={client.sockets[0].transport} />
                                            )}
                                        </TableCell>
                                        <TableCell>{client.sockets.length}</TableCell>
                                        <TableCell align="right">
                                            {isSocketDisconnectSupported && (
                                                <Tooltip title={t('clients.disconnect')}>
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDisconnect(client);
                                                        }}
                                                        disabled={isReadonly || client.sockets.length === 0}
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
                                    count={clients.length}
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
        </div>
    );
};

export default Clients;
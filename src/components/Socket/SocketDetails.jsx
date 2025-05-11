import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {
    Card,
    CardHeader,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableRow,
    IconButton,
    Tooltip,
    Link,
    Typography,
    Box
} from '@mui/material';
import { Logout as DisconnectIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Transport from '../Transport';
import ConnectionStatus from '../ConnectionStatus';
import SocketHolder from '../../SocketHolder';

const SocketDetails = ({ socket, client }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Redux state
    const isReadonly = useSelector(state => state.config.readonly);
    const isSocketDisconnectSupported = useSelector(state =>
        state.config.supportedFeatures.includes('DISCONNECT')
    );

    // Computed values
    const creationDate = new Date(socket.handshake.issued).toISOString();

    // Event handlers
    const navigateToClient = () => {
        navigate(`/clients/${client.id}`);
    };

    const disconnectClient = () => {
        SocketHolder.socket.emit('_disconnect', socket.nsp, true, socket.id);
    };

    const disconnectSocket = () => {
        SocketHolder.socket.emit('_disconnect', socket.nsp, false, socket.id);
    };

    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader title={t('details')} />

            {/* Client Details Section */}
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {t('sockets.client')}
                </Typography>

                <Table size="small">
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ width: '30%' }}>{t('id')}</TableCell>
                            <TableCell>
                                {client.connected ? (
                                    <Link
                                        component="button"
                                        onClick={navigateToClient}
                                        sx={{ color: 'inherit' }}
                                    >
                                        {client.id}
                                    </Link>
                                ) : (
                                    <span>{client.id}</span>
                                )}
                            </TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>{t('status')}</TableCell>
                            <TableCell>
                                <ConnectionStatus connected={client.connected} />
                            </TableCell>
                            <TableCell align="right">
                                {isSocketDisconnectSupported && client.connected && (
                                    <Tooltip title={t('clients.disconnect')}>
                                        <IconButton
                                            onClick={disconnectClient}
                                            disabled={isReadonly}
                                            size="small"
                                        >
                                            <DisconnectIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>{t('sockets.transport')}</TableCell>
                            <TableCell>
                                <Transport transport={socket.transport} />
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>{t('sockets.address')}</TableCell>
                            <TableCell>{socket.handshake.address}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>

            {/* Socket Details Section */}
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {t('sockets.socket')}
                </Typography>

                <Table size="small">
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ width: '30%' }}>{t('namespace')}</TableCell>
                            <TableCell>
                                <Box component="code">{socket.nsp}</Box>
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>{t('id')}</TableCell>
                            <TableCell>{socket.id}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>{t('data')}</TableCell>
                            <TableCell>
                                <Box component="pre" sx={{ margin: 0 }}>
                                    <code>{JSON.stringify(socket.data, null, 2)}</code>
                                </Box>
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>{t('status')}</TableCell>
                            <TableCell>
                                <ConnectionStatus connected={socket.connected} />
                            </TableCell>
                            <TableCell align="right">
                                {isSocketDisconnectSupported && socket.connected && (
                                    <Tooltip title={t('sockets.disconnect')}>
                                        <IconButton
                                            onClick={disconnectSocket}
                                            disabled={isReadonly}
                                            size="small"
                                        >
                                            <DisconnectIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>{t('sockets.creation-date')}</TableCell>
                            <TableCell>{creationDate}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default SocketDetails;
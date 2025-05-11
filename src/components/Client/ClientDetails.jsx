import React from 'react';
import { useSelector } from 'react-redux';
import {
    Card,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableRow,
    IconButton,
    Tooltip,
    Box
} from '@mui/material';
import { Logout as DisconnectIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Transport from '../Transport';
import ConnectionStatus from '../ConnectionStatus';
import SocketHolder from '../../SocketHolder';

const ClientDetails = ({ client, socket }) => {
    const { t } = useTranslation();

    // Redux state
    const isReadonly = useSelector(state => state.config.readonly);
    const isSocketDisconnectSupported = useSelector(state =>
        state.config.supportedFeatures.includes('DISCONNECT')
    );

    // Handle disconnect action
    const handleDisconnect = () => {
        if (socket) {
            SocketHolder.socket.emit('_disconnect', socket.nsp, true, socket.id);
        }
    };

    if (!client || !socket) {
        return null;
    }

    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader title={t('details')} />

            <Table size="small">
                <TableBody>
                    <TableRow>
                        <TableCell sx={{ width: '30%', fontWeight: 'medium' }}>
                            {t('id')}
                        </TableCell>
                        <TableCell>{client.id}</TableCell>
                        <TableCell />
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
                                        onClick={handleDisconnect}
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
                        <TableCell />
                    </TableRow>

                    <TableRow>
                        <TableCell>{t('sockets.address')}</TableCell>
                        <TableCell>{socket.handshake?.address}</TableCell>
                        <TableCell />
                    </TableRow>
                </TableBody>
            </Table>
        </Card>
    );
};

export default ClientDetails;
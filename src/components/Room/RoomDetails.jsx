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
import { useTranslation } from 'react-i18next';
import SocketHolder from '../../SocketHolder';
import RoomStatus from './RoomStatus';
import RoomType from './RoomType';
import Icon from '@mdi/react';
import { mdiTagOffOutline } from '@mdi/js';

const RoomDetails = ({ room, nsp }) => {
    const { t } = useTranslation();

    // Redux state
    const isReadonly = useSelector(state => state.config.readonly);
    const isMultiLeaveSupported = useSelector(state =>
        state.config.supportedFeatures.includes('MLEAVE')
    );

    // Handle clear action
    const handleClear = () => {
        SocketHolder.socket.emit('leave', nsp, room.name);
    };

    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader title={t('details')} />

            <Table size="small">
                <TableBody>
                    <TableRow>
                        <TableCell sx={{ width: '30%', fontWeight: 'medium' }}>
                            {t('namespace')}
                        </TableCell>
                        <TableCell>
                            <Box component="code">{nsp}</Box>
                        </TableCell>
                        <TableCell />
                    </TableRow>

                    <TableRow>
                        <TableCell>{t('id')}</TableCell>
                        <TableCell>{room.name}</TableCell>
                        <TableCell />
                    </TableRow>

                    <TableRow>
                        <TableCell>{t('status')}</TableCell>
                        <TableCell>
                            <RoomStatus active={room.active} />
                        </TableCell>
                        <TableCell align="right">
                            {isMultiLeaveSupported && !room.isPrivate && (
                                <Tooltip title={t('rooms.clear')}>
                                    <IconButton
                                        onClick={handleClear}
                                        disabled={isReadonly}
                                        size="small"
                                        sx={{ ml: 1 }}
                                    >
                                        <Icon path={mdiTagOffOutline} size={1} />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>{t('type')}</TableCell>
                        <TableCell>
                            <RoomType isPrivate={room.isPrivate} />
                        </TableCell>
                        <TableCell />
                    </TableRow>
                </TableBody>
            </Table>
        </Card>
    );
};

export default RoomDetails;
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Card,
    CardHeader,
    CardContent,
    Typography
} from '@mui/material';
import KeyValueTable from '../KeyValueTable';

const InitialRequest = ({ socket }) => {
    const { t } = useTranslation();

    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader title={t('sockets.initial-request')} />

            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {t('sockets.headers')}
                </Typography>
                <KeyValueTable object={socket.handshake.headers} />
            </CardContent>

            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {t('sockets.query-params')}
                </Typography>
                <KeyValueTable object={socket.handshake.query} />
            </CardContent>
        </Card>
    );
};

export default InitialRequest;
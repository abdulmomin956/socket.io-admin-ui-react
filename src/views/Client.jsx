import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import {
    Breadcrumbs,
    Link,
    Typography,
    Container,
    Grid,
    Box,
    Grid2
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ClientDetails from '../components/Client/ClientDetails';
import InitialRequest from '../components/Socket/InitialRequest';
import ClientSockets from '../components/Client/ClientSockets';
import { find } from 'lodash-es';

const Client = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);


    // Breadcrumb items
    const breadcrumbItems = [
        {
            text: t('clients.title'),
            onClick: () => navigate('/clients')
        },
        {
            text: t('clients.details'),
            disabled: true
        }
    ];

    // Load client data when component mounts or params change
    const clientData = useSelector(state => {
        return find(state.main.clients, { id });
    })

    useEffect(() => {
        if (clientData && clientData.sockets.length > 0 && !socket) {
            setSocket(clientData.sockets[0]);
        }
    }, [])


    if (!socket) {
        return <Typography variant="body1">Loading client data...</Typography>;
    }

    return (
        <div>
            {/* Breadcrumbs */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
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
            <Container maxWidth={false}>
                <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
                        <ClientDetails client={clientData} socket={socket} />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
                        {socket && <InitialRequest socket={socket} />}
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
                        <ClientSockets sockets={clientData.sockets} />
                    </Grid2>
                </Grid2>
            </Container>
        </div>
    );
};

export default Client;
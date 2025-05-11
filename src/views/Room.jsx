import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import {
    Breadcrumbs,
    Link,
    Typography,
    Container,
    Box,
    Grid2
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import RoomSockets from '../components/Room/RoomSockets';
import RoomDetails from '../components/Room/RoomDetails';
import { find } from 'lodash-es';

const Room = () => {
    const { t } = useTranslation();
    const { nsp, name } = useParams();
    const navigate = useNavigate();

    const room = useSelector(state => {
        const namespace = find(state.main.namespaces, { name: nsp });
        if (namespace) {
            return find(namespace.rooms, { name });
        }
    })


    const breadcrumbItems = [
        {
            text: t('rooms.title'),
            onClick: () => navigate('/rooms')
        },
        {
            text: t('rooms.details'),
            disabled: true
        }
    ];

    if (!room) {
        return <Typography variant="body1">Loading room data...</Typography>;
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
                    <Grid2 size={{ xs: 12, md: 4 }}>
                        <RoomDetails room={room} nsp={nsp} />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 8 }}>
                        <RoomSockets room={room} />
                    </Grid2>
                </Grid2>
            </Container>
        </div>
    );
};

export default Room;
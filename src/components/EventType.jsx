import React from 'react';
import { useTranslation } from 'react-i18next';
import { Chip } from '@mui/material';
import {
    green,
    teal,
    amber,
    red,
    blue,
    orange,
    grey
} from '@mui/material/colors';

const EventType = ({ type }) => {
    const { t } = useTranslation();

    // Color mapping based on event type
    const getColor = () => {
        switch (type) {
            case 'connection':
                return green[500];
            case 'room_joined':
                return teal[500];
            case 'room_left':
                return amber[500];
            case 'disconnection':
                return red[500];
            case 'event_received':
                return blue[500];
            case 'event_sent':
                return orange[500];
            default:
                return grey[500];
        }
    };

    return (
        <Chip
            label={t(`events.type.${type}`)}
            variant="outlined"
            sx={{
                color: getColor(),
                borderColor: getColor(),
                backgroundColor: 'transparent'
            }}
        />
    );
};

export default EventType;
import React from 'react';
import { Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function Transport({ transport }) {
    const theme = useTheme();

    const getLabel = () => {
        switch (transport) {
            case "polling":
                return "HTTP long-polling";
            case "websocket":
                return "WebSocket";
            default:
                return transport;
        }
    };

    const getColor = () => {
        switch (transport) {
            case "polling":
                return theme.palette.warning.main;
            case "websocket":
                return theme.palette.success.main;
            default:
                return theme.palette.grey[500];
        }
    };

    return (
        <Chip
            size="small"
            label={getLabel()}
            variant="outlined"
            sx={{
                color: getColor(),
                borderColor: getColor(),
                textTransform: 'capitalize'
            }}
        />
    );
}

// PropTypes for type checking (optional)
// Transport.propTypes = {
//     transport: PropTypes.string.isRequired
// };
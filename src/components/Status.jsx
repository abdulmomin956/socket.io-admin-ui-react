import React from 'react';
import { Chip } from '@mui/material';
import { green, red } from '@mui/material/colors';

export default function Status({ value, okLabel, koLabel }) {
    const label = value ? okLabel : koLabel;
    const color = value ? green[500] : red[500];

    return (
        <Chip
            size="small"
            label={label.toUpperCase()}
            variant="outlined"
            sx={{
                color: color,
                borderColor: color,
                textTransform: 'uppercase',
                fontWeight: 'bold'
            }}
        />
    );
}

// PropTypes for type checking (optional)
// Status.propTypes = {
//     value: PropTypes.bool,
//     okLabel: PropTypes.string,
//     koLabel: PropTypes.string
// };
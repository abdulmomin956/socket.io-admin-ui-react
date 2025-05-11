import React from 'react';
import { useTranslation } from 'react-i18next';
import Status from './Status';

export default function ConnectionStatus({ connected }) {
    const { t } = useTranslation();

    return (
        <Status
            value={connected}
            okLabel={t('connected')}
            koLabel={t('disconnected')}
        />
    );
}

// PropTypes for type checking (optional)
// ConnectionStatus.propTypes = {
//     connected: PropTypes.bool
// };
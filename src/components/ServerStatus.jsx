import React from 'react';
import { useTranslation } from 'react-i18next';
import Status from './Status';

export default function ServerStatus({ healthy = false }) {
    const { t } = useTranslation();

    return (
        <Status
            value={healthy}
            okLabel={t('servers.healthy')}
            koLabel={t('servers.unhealthy')}
        />
    );
}

// PropTypes for type checking (optional)
// ServerStatus.propTypes = {
//     healthy: PropTypes.bool
// };

// Default props (optional)
ServerStatus.defaultProps = {
    healthy: false
};
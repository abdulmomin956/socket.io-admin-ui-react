import React from 'react';
import { useTranslation } from 'react-i18next';
import Status from '../Status';

const RoomStatus = ({ active }) => {
    const { t } = useTranslation();

    return (
        <Status
            value={active}
            okLabel={t('rooms.active')}
            koLabel={t('rooms.deleted')}
        />
    );
};

export default RoomStatus;
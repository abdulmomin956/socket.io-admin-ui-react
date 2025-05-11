import React from 'react';
import { useTranslation } from 'react-i18next';
import Status from '../Status';

const RoomType = ({ isPrivate }) => {
    const { t } = useTranslation();

    return (
        <Status
            value={!isPrivate}
            okLabel={t('rooms.public')}
            koLabel={t('rooms.private')}
        />
    );
};

export default RoomType;
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FormControlLabel, Switch } from '@mui/material';

export default function ReadonlyToggle() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const readonly = useSelector(state => state.config.readonly);
    const disabled = useSelector(state => state.config.supportedFeatures.length === 0);

    const handleToggle = () => {
        dispatch({ type: 'config/toggleReadonly' });
    };

    return (
        <FormControlLabel
            control={
                <Switch
                    checked={readonly}
                    onChange={handleToggle}
                    disabled={disabled}
                    size="small"
                />
            }
            label={t('config.readonly')}
            sx={{
                marginLeft: 0,
                marginRight: 0,
                justifyContent: 'space-between',
                width: '100%'
            }}
        />
    );
}
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FormControlLabel, Switch } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { selectTheme } from '../store/modules/config';

export default function ThemeSelector() {
    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();
    const darkTheme = useSelector(state => state.config.darkTheme);

    const onSelectTheme = (event) => {
        const isDark = event.target.checked;
        dispatch(selectTheme(isDark));
        // You'll need to implement theme switching logic in your theme provider
    };

    return (
        <FormControlLabel
            control={
                <Switch
                    checked={darkTheme}
                    onChange={onSelectTheme}
                    size="small"
                />
            }
            label={t('config.dark-theme')}
            sx={{
                marginLeft: 0,
                marginRight: 0,
                justifyContent: 'space-between',
                width: '100%'
            }}
        />
    );
}
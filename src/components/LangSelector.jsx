import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from '@mui/material';
import { selectLang } from '../store/modules/config';
// import i18n from '../i18n';

export default function LangSelector() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const lang = useSelector(state => state.config.lang);
    const darkTheme = useSelector(state => state.config.darkTheme);

    const languages = [
        { text: "বাংলা", value: "bn" },
        { text: "English", value: "en" },
        { text: "Français", value: "fr" },
        { text: "한국어", value: "ko" },
        { text: "Português (Brazil)", value: "pt-BR" },
        { text: "Türkçe", value: "tr" },
        { text: "简体中文", value: "zh-CN" }
    ];

    const onSelectLang = (event) => {
        const newLang = event.target.value;
        // console.log(newLang)
        i18n.changeLanguage(newLang);
        dispatch(selectLang(newLang))
        // selectLang(newLang);
        //dispatch({ type: 'config/SELECT_LANG', payload: newLang });
    };

    return (
        <FormControl fullWidth size="small" sx={{ mt: 1, background: darkTheme ? 'rgb(54,54,54)' : 'white' }}>
            <InputLabel sx={{ color: darkTheme ? 'white' : 'black', background: darkTheme ? 'rgb(54,54,54)' : 'white' }}>{t('config.language')}</InputLabel>
            <Select
                value={lang}
                onChange={onSelectLang}
                label={t('config.language')}
                sx={{ color: darkTheme ? 'white' : 'black', background: darkTheme ? 'rgb(54,54,54)' : 'white' }}
            >
                {languages.map((language) => (
                    <MenuItem sx={{ color: darkTheme ? 'white' : 'black', background: darkTheme ? 'rgb(54,54,54)' : 'white' }} key={language.value} value={language.value}>
                        {language.text}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
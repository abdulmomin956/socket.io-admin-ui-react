import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { find, sortBy } from 'lodash-es';
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { selectNamespace } from '../store/modules/mainSlice';

const NamespaceSelector = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // Redux state
    const selectedNamespace = useSelector(state => state.main.selectedNamespace);
    const unsortedNamespaces = useSelector(state => state.main.namespaces);

    const namespaces = useMemo(() =>
        sortBy(unsortedNamespaces, 'name'),
        [unsortedNamespaces]
    );

    const handleNamespaceChange = (event) => {
        dispatch(selectNamespace({ namespace: find(namespaces, { name: event.target.value }) }))
    };

    useEffect(() => {
        dispatch(selectNamespace({ namespace: find(namespaces, { name: selectedNamespace?.name }) }))
    }, [namespaces])


    return (
        <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>{t('select-namespace')}</InputLabel>
            <Select
                value={selectedNamespace?.name || ''}
                onChange={handleNamespaceChange}
                label={t('select-namespace')}
                renderValue={(selected) => {
                    const ns = namespaces.find(n => n.name === selected);
                    return ns?.name || selected;
                }}
            >
                {namespaces.map((namespace) => (
                    <MenuItem
                        key={namespace.name}
                        value={namespace.name}
                    >
                        {namespace.name}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>{t('select-namespace')}</FormHelperText>
        </FormControl>
    );
};

export default NamespaceSelector;
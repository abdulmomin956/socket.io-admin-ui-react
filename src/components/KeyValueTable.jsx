import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';

const KeyValueTable = ({ object }) => {
    const { t } = useTranslation();

    // Process object into sorted items
    const items = React.useMemo(() => {
        if (!object) return [];
        return Object.keys(object)
            .sort()
            .map(key => ({ key, value: object[key] }));
    }, [object]);

    if (!object || items.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary">
                {t('noDataAvailable')}
            </Typography>
        );
    }

    return (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>{t('name')}</TableCell>
                    <TableCell>{t('value')}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {items.map(({ key, value }) => (
                    <TableRow key={key}>
                        <TableCell sx={{ width: '30%', fontWeight: 'medium' }}>
                            {key}
                        </TableCell>
                        <TableCell>
                            {typeof value === 'object'
                                ? JSON.stringify(value, null, 2)
                                : String(value)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default KeyValueTable;
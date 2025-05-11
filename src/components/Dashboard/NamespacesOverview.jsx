import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    Card,
    CardHeader,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Box,
    Typography
} from '@mui/material';
import { Link } from 'react-router';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { sortBy } from 'lodash-es';
import { getLiteNamespaces } from '../../store/selectors';

export default function NamespacesOverview() {
    const { t } = useTranslation();
    const darkTheme = useSelector(state => state.config.darkTheme);

    // Redux state selectors
    const mainNamespaces = useSelector(state => state.main.namespaces);
    const hasAggregatedValues = useSelector(state =>
        state.config.supportedFeatures.includes("AGGREGATED_EVENTS")
    );
    const developmentMode = useSelector(state =>
        state.config.supportedFeatures.includes("ALL_EVENTS") ||
        !state.config.supportedFeatures.includes("AGGREGATED_EVENTS")
    );
    // const liteNamespaces = useSelector(state => {
    //     const namespaces = {};
    //     for (const server of state.servers.servers) {
    //         if (server.namespaces) {
    //             for (const { name, socketsCount } of server.namespaces) {
    //                 namespaces[name] = (namespaces[name] || 0) + socketsCount;
    //             }
    //         }
    //     }
    //     return Object.keys(namespaces).map(name => ({
    //         name,
    //         socketsCount: namespaces[name]
    //     }));
    // });

    const liteNamespaces = useSelector(getLiteNamespaces);

    // Process namespaces data
    const plainNamespaces = sortBy(mainNamespaces, "name").map(({ name, sockets }) => ({
        name,
        socketsCount: sockets.length
    }));
    // console.log(hasAggregatedValues, liteNamespaces, plainNamespaces)
    const namespaces = hasAggregatedValues ? liteNamespaces : plainNamespaces;

    return (
        <Card sx={{
            color: darkTheme ? 'white' : 'black',
            background: darkTheme ? 'rgb(30,30,30)' : 'white',
            height: '100%'
        }}>
            <CardHeader
                title={t("namespaces")}
                action={
                    developmentMode && (
                        <Button
                            component={Link}
                            to="/sockets"
                            size="small"
                            sx={{ minWidth: 0 }}
                        >
                            <MoreHorizIcon />
                        </Button>
                    )
                }
                sx={{
                    '& .MuiCardHeader-action': {
                        margin: 0
                    }
                }}
            />

            <Box sx={{ overflow: 'auto' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: darkTheme ? 'white' : 'black' }}><Typography variant="subtitle2">{t("name")}</Typography></TableCell>
                            <TableCell sx={{ color: darkTheme ? 'white' : 'black' }}><Typography variant="subtitle2">{t("rooms.sockets-count")}</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {namespaces.map(namespace => (
                            <TableRow key={namespace.name}>
                                <TableCell sx={{ fontFamily: 'monospace', paddingY: 0, height: '48px', color: darkTheme ? 'white' : 'black' }}>
                                    {namespace.name}
                                </TableCell>
                                <TableCell sx={{ paddingY: 0, color: darkTheme ? 'white' : 'black' }}>
                                    {namespace.socketsCount}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Card>
    );
}
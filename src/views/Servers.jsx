import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sortBy } from 'lodash-es';
import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableFooter,
    TablePagination,
    Breadcrumbs,
    Typography,
    IconButton,
    Box
} from '@mui/material';
import { DeleteOutline as DeleteIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import ServerStatus from '../components/ServerStatus';
import { formatDuration } from '../util';

const Servers = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [now, setNow] = useState(Date.now());
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    // Redux state
    // const servers = useSelector(state => sortBy(state.servers.servers, 'serverId'));
    const unsortedServers = useSelector(state => state.servers.servers);
    const servers = useMemo(() =>
        sortBy(unsortedServers, 'serverId'),
        [unsortedServers]
    );

    // Update current time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Breadcrumb items
    const breadcrumbItems = [
        { text: t('servers.title'), disabled: true }
    ];

    // Table headers
    const headers = [
        { id: 'serverId', label: t('id') },
        { id: 'hostname', label: t('servers.hostname') },
        { id: 'pid', label: t('servers.pid') },
        { id: 'uptime', label: t('servers.uptime') },
        { id: 'clientsCount', label: t('servers.clients-count') },
        { id: 'lastPing', label: t('servers.last-ping') },
        { id: 'healthy', label: t('status') },
        { id: 'actions', label: '', align: 'right' }
    ];

    // Helper functions
    const delaySinceLastPing = (lastPing) => {
        const delay = now - lastPing;
        return `${formatDuration(delay / 1000)} ago`;
    };

    const handleRemoveServer = (serverId) => {
        dispatch({ type: 'servers/removeServer', payload: serverId });
    };

    return (
        <div>
            {/* Breadcrumbs */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                {breadcrumbItems.map((item, index) => (
                    <Typography key={index} color="textPrimary">
                        {item.text}
                    </Typography>
                ))}
            </Breadcrumbs>

            {/* Main card */}
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {headers.map(header => (
                                    <TableCell
                                        key={header.id}
                                        align={header.align || 'left'}
                                    >
                                        {header.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {servers
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(server => (
                                    <TableRow key={server.serverId}>
                                        <TableCell>{server.serverId}</TableCell>
                                        <TableCell>{server.hostname}</TableCell>
                                        <TableCell>{server.pid}</TableCell>
                                        <TableCell>{formatDuration(server.uptime)}</TableCell>
                                        <TableCell>{server.clientsCount}</TableCell>
                                        <TableCell>{delaySinceLastPing(server.lastPing)}</TableCell>
                                        <TableCell>
                                            <ServerStatus healthy={server.healthy} />
                                        </TableCell>
                                        <TableCell align="right">
                                            {!server.healthy && (
                                                <Tooltip title={t('delete')}>
                                                    <IconButton
                                                        onClick={() => handleRemoveServer(server.serverId)}
                                                        size="small"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[20, 100, { label: t('all'), value: -1 }]}
                                    count={servers.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={(_, newPage) => setPage(newPage)}
                                    onRowsPerPageChange={(e) => {
                                        setRowsPerPage(parseInt(e.target.value, 10));
                                        setPage(0);
                                    }}
                                    labelRowsPerPage={t('rowsPerPage')}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Card>
        </div>
    );
};

export default Servers;
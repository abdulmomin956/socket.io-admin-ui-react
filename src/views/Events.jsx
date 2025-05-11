import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {
    Card,
    CardContent,
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
    Link,
    IconButton,
    Collapse,
    Box,
    Paper,
    TableSortLabel
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import NamespaceSelector from '../components/NamespaceSelector';
import EventType from '../components/EventType';

const Events = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [expandedRows, setExpandedRows] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    const selectedNamespace = useSelector(state => state.main.selectedNamespace);
    const events = selectedNamespace ? selectedNamespace.events : [];

    const [sortBy, setSortBy] = useState('timestamp');
    const [sortDesc, setSortDesc] = useState(true);

    const breadcrumbItems = [
        { text: t('events.title'), disabled: true }
    ];

    const headers = [
        { id: 'timestamp', label: t('timestamp') },
        { id: 'id', label: t('sockets.socket'), sortable: false },
        { id: 'type', label: t('type'), sortable: false },
        { id: 'args', label: '', sortable: false },
        { id: 'expand', label: '', sortable: false }
    ];

    const handleRowExpand = (eventId) => {
        setExpandedRows(prev => ({
            ...prev,
            [eventId]: !prev[eventId]
        }));
    };

    const isExpandable = (item) => {
        return ['event_received', 'event_sent'].includes(item.type);
    };

    const getArgsDisplay = (item) => {
        if (isExpandable(item)) {
            return `${t('events.eventName')}${t('separator')}`;
        } else if (item.type === 'disconnection') {
            return `${t('events.reason')}${t('separator')}`;
        } else if (item.type === 'room_joined' || item.type === 'room_left') {
            return `${t('events.room')}${t('separator')}`;
        }
        return item.args;
    };

    const handleSocketClick = (sid) => {
        navigate(`/n/${encodeURIComponent(selectedNamespace.name)}/sockets/${sid}`);
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDesc(!sortDesc);
        } else {
            setSortBy(column);
            setSortDesc(true);
        }
    };

    const sortedEvents = [...events].sort((a, b) => {
        const aVal = sortBy === 'timestamp' ? new Date(a.timestamp) : a[sortBy];
        const bVal = sortBy === 'timestamp' ? new Date(b.timestamp) : b[sortBy];
        return sortDesc ? bVal - aVal : aVal - bVal;
    });


    return (
        <div>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                {breadcrumbItems.map((item, index) => (
                    <Typography key={index} color="textPrimary">
                        {item.text}
                    </Typography>
                ))}
            </Breadcrumbs>


            <Card>
                <CardContent>
                    <NamespaceSelector />
                </CardContent>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {headers.map(header => (
                                    header.id === "timestamp" ?
                                        <TableCell key={header.id}>
                                            <TableSortLabel
                                                active={sortBy === 'timestamp'}
                                                direction={sortDesc ? 'desc' : 'asc'}
                                                onClick={() => handleSort('timestamp')}
                                            >
                                                Timestamp
                                            </TableSortLabel>
                                        </TableCell>
                                        :
                                        <TableCell key={header.id}>
                                            {header.label}
                                        </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {/* {events && events */}
                            {sortedEvents
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(event => (
                                    <React.Fragment key={event.eventId}>
                                        <TableRow>
                                            <TableCell>{event.timestamp}</TableCell>
                                            <TableCell>
                                                <Link
                                                    component="button"
                                                    onClick={() => handleSocketClick(event.id)}
                                                    sx={{ color: 'inherit' }}
                                                >
                                                    {event.id}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <EventType type={event.type} />
                                            </TableCell>
                                            <TableCell>
                                                <Box component="span">
                                                    {getArgsDisplay(event)}
                                                    {isExpandable(event) && (
                                                        <Box component="code" sx={{ ml: 1 }}>
                                                            {event.eventName}
                                                        </Box>
                                                    )}
                                                    {!isExpandable(event) && (
                                                        <Box component="code" sx={{ ml: 1 }}>
                                                            {event.args}
                                                        </Box>
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {isExpandable(event) && (
                                                    <IconButton
                                                        onClick={() => handleRowExpand(event.eventId)}
                                                        size="small"
                                                    >
                                                        {expandedRows[event.eventId] ? (
                                                            <ExpandLessIcon />
                                                        ) : (
                                                            <ExpandMoreIcon />
                                                        )}
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        </TableRow>


                                        <TableRow>
                                            <TableCell colSpan={headers.length} sx={{ p: 0 }}>
                                                <Collapse in={expandedRows[event.eventId]}>
                                                    <Box sx={{ p: 3 }}>
                                                        <Typography variant="body2" gutterBottom>
                                                            {t('events.eventArgs')}{t('separator')}
                                                        </Typography>
                                                        <Box
                                                            component="pre"
                                                            sx={{
                                                                bgcolor: 'background.default',
                                                                p: 2,
                                                                borderRadius: 1,
                                                                overflowX: 'auto'
                                                            }}
                                                        >
                                                            <code>{JSON.stringify(event.args, null, 2)}</code>
                                                        </Box>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50, { label: t('all'), value: -1 }]}
                                    count={events.length}
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

export default Events;
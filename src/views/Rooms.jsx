import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import { sortBy } from 'lodash-es';
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
    IconButton,
    Tooltip,
    Switch,
    FormControlLabel,
    Box
} from '@mui/material';
import {
    // TagOffOutlined as ClearIcon,
    Logout as DisconnectIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import NamespaceSelector from '../components/NamespaceSelector';
import RoomType from '../components/Room/RoomType';
import SocketHolder from '../SocketHolder';

const Rooms = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const [showPrivateRooms, setShowPrivateRooms] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const selectedNamespace = useSelector(state => state.main.selectedNamespace);
    const rooms = selectedNamespace ? selectedNamespace.rooms : [];
    const isReadonly = useSelector(state => state.config.readonly);
    const isMultiLeaveSupported = useSelector(state =>
        state.config.supportedFeatures.includes('MLEAVE')
    );
    const isMultiDisconnectSupported = useSelector(state =>
        state.config.supportedFeatures.includes('MDISCONNECT')
    );

    const filteredRooms = showPrivateRooms
        ? sortBy(rooms, 'name')
        : sortBy(rooms.filter(room => !room.isPrivate), 'name');


    const breadcrumbItems = [
        { text: t('rooms.title'), disabled: true }
    ];

    // Table headers
    const headers = [
        { id: 'name', label: t('id'), align: 'left' },
        { id: 'isPrivate', label: t('type') },
        { id: 'sockets', label: t('rooms.sockets-count') },
        { id: 'actions', label: '', align: 'right' }
    ];

    // Handle private rooms switch change
    const handlePrivateRoomsChange = (event) => {
        const show = event.target.checked;
        setShowPrivateRooms(show);
        navigate(`/rooms${show ? '?p=1' : ''}`, { replace: true });
    };

    // Action handlers
    const handleClear = (room) => {
        SocketHolder.socket.emit('leave', selectedNamespace.name, room.name);
    };

    const handleDisconnect = (room) => {
        SocketHolder.socket.emit(
            '_disconnect',
            selectedNamespace.name,
            false,
            room.name
        );
    };

    const handleRowClick = (room) => {
        navigate(`/n/${encodeURIComponent(selectedNamespace.name)}/rooms/${room.name}`);
    };

    // Initialize from URL query
    useEffect(() => {
        setShowPrivateRooms(new URLSearchParams(location.search).get('p') === '1');
    }, [location.search]);

    return (
        <div>
            {/* Breadcrumbs */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                {breadcrumbItems.map((item, index) => (
                    <Typography
                        key={index}
                        color={item.disabled ? 'textPrimary' : 'inherit'}
                    >
                        {item.text}
                    </Typography>
                ))}
            </Breadcrumbs>

            {/* Main card */}
            <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <NamespaceSelector />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showPrivateRooms}
                                onChange={handlePrivateRoomsChange}
                                size="small"
                            />
                        }
                        label={t('rooms.show-private')}
                        sx={{ ml: 2 }}
                    />
                </CardContent>

                {/* Table */}
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
                            {filteredRooms
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(room => (
                                    <TableRow
                                        key={room.name}
                                        hover
                                        onClick={() => handleRowClick(room)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>{room.name}</TableCell>
                                        <TableCell>
                                            <RoomType isPrivate={room.isPrivate} />
                                        </TableCell>
                                        <TableCell>{room.sockets.length}</TableCell>
                                        <TableCell align="right">
                                            {isMultiLeaveSupported && !room.isPrivate && (
                                                <Tooltip title={t('rooms.clear')}>
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleClear(room);
                                                        }}
                                                        disabled={isReadonly}
                                                        size="small"
                                                        sx={{ ml: 1 }}
                                                    >
                                                        {/* <ClearIcon /> */}
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {isMultiDisconnectSupported && (
                                                <Tooltip title={t('rooms.disconnect')}>
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDisconnect(room);
                                                        }}
                                                        disabled={isReadonly}
                                                        size="small"
                                                        sx={{ ml: 1 }}
                                                    >
                                                        <DisconnectIcon />
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
                                    rowsPerPageOptions={[20, 100, { label: 'All', value: -1 }]}
                                    count={filteredRooms.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={(e, newPage) => setPage(newPage)}
                                    onRowsPerPageChange={(e) => {
                                        setRowsPerPage(parseInt(e.target.value, 10));
                                        setPage(0);
                                    }}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Card>
        </div>
    );
};

export default Rooms;
import React from 'react';
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
    IconButton,
    Tooltip,
    Typography
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import NamespaceSelector from '../components/NamespaceSelector';
import Transport from '../components/Transport';
import SocketHolder from '../SocketHolder';

const Sockets = () => {
    const navigate = useNavigate();
    const selectedNamespace = useSelector(state => state.main.selectedNamespace);
    const sockets = selectedNamespace ? selectedNamespace.sockets : []
    const isReadonly = useSelector(state => state.config.readonly);
    const isSocketDisconnectSupported = useSelector(state =>
        state.config.supportedFeatures.includes('DISCONNECT')
    );

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);


    const breadcrumbItems = [
        { text: 'Sockets', disabled: true }
    ];


    const headers = [
        { id: 'id', label: '#', align: 'left' },
        { id: 'address', label: 'Address' },
        { id: 'transport', label: 'Transport' },
        { id: 'actions', label: 'Actions', align: 'right' }
    ];

    const displayDetails = (socket) => {
        navigate(`/n/${encodeURIComponent(selectedNamespace.name)}/sockets/${socket.id}`);
    };


    const disconnect = (socket) => {
        SocketHolder.socket.emit('_disconnect', socket.nsp, false, socket.id);
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div>
            <Breadcrumbs aria-label="breadcrumb">
                {breadcrumbItems.map((item, index) => (
                    <Typography
                        key={index}
                        color={item.disabled ? 'textPrimary' : 'inherit'}
                    >
                        {item.text}
                    </Typography>
                ))}
            </Breadcrumbs>


            <Card >
                <CardContent>
                    <NamespaceSelector />
                </CardContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {headers.map((header) => (
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
                            {sockets
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((socket) => (
                                    <TableRow
                                        key={socket.id}
                                        hover
                                        onClick={() => displayDetails(socket)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>{socket.id}</TableCell>
                                        <TableCell>{socket.handshake?.address}</TableCell>
                                        <TableCell>
                                            <Transport transport={socket.transport} />
                                        </TableCell>
                                        <TableCell align="right">
                                            {isSocketDisconnectSupported && (
                                                <Tooltip title="Disconnect">
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            disconnect(socket);
                                                        }}
                                                        disabled={isReadonly}
                                                        size="small"
                                                    >
                                                        <LogoutIcon />
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
                                    count={sockets.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Card>
        </div>
    );
};

export default Sockets;
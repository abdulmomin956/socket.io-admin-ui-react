import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    Card,
    CardHeader,
    CardContent,
    Button,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Box,
    Typography,
    useTheme
} from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { sumBy } from 'lodash-es';
import Transport from '../Transport';
import { percentage } from '../../util';
import { Link } from 'react-router';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

ChartJS.register(ArcElement, Tooltip);

export default function ClientsOverview() {
    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();

    const clients = useSelector(state => state.main.clients);
    const darkTheme = useSelector(state => state.config.darkTheme);
    const servers = useSelector(state => state.servers.servers);
    const hasAggregatedValues = useSelector(state =>
        state.config.supportedFeatures.includes("AGGREGATED_EVENTS")
    );
    const developmentMode = useSelector(state =>
        state.config.supportedFeatures.includes("ALL_EVENTS") ||
        !state.config.supportedFeatures.includes("AGGREGATED_EVENTS")
    );

    const transports = ["websocket", "polling"];

    const clientsCount = hasAggregatedValues
        ? sumBy(servers, "clientsCount")
        : clients.length;

    const transportRepartition = hasAggregatedValues
        ? {
            polling: sumBy(servers, "pollingClientsCount"),
            websocket: clientsCount - sumBy(servers, "pollingClientsCount")
        }
        : clients
            .map(client => client.sockets[0])
            .filter(socket => !!socket)
            .reduce(
                (acc, socket) => {
                    acc[socket.transport]++;
                    return acc;
                },
                { websocket: 0, polling: 0 }
            );

    const data = {
        labels: ["WebSocket", "HTTP long-polling"],
        datasets: [
            {
                backgroundColor: [theme.palette.success.main, theme.palette.warning.main],
                borderColor: darkTheme ? theme.palette.common.black : theme.palette.common.white,
                data: [
                    transportRepartition["websocket"],
                    transportRepartition["polling"]
                ]
            }
        ]
    };

    const chartOptions = {
        plugins: {
            legend: {
                display: false
            }
        }
    };

    return (
        <Card sx={{
            color: darkTheme ? 'white' : 'black',
            background: darkTheme ? 'rgb(30,30,30)' : 'white'
        }}>
            <CardHeader
                title={t("clients.title")}
                action={
                    developmentMode && (
                        <Button
                            component={Link}
                            to="/clients"
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

            <CardContent sx={{
                padding: 0, "&:last-child": {
                    paddingBottom: 0
                }
            }}>
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    // flexDirection: { xs: 'column', sm: 'row' },
                    // flexDirection: 'row',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Box sx={{
                        maxWidth: 160,
                        margin: 2
                    }}>
                        <Doughnut data={data} options={chartOptions} />
                    </Box>

                    <Table
                        size="small"
                        sx={{ width: 'auto', flexGrow: 1, flexShrink: 0 }}
                    >
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ color: darkTheme ? 'white' : 'black' }}><Typography variant="subtitle2">{t("sockets.transport")}</Typography></TableCell>
                                <TableCell sx={{ color: darkTheme ? 'white' : 'black' }}><Typography variant="subtitle2">#</Typography></TableCell>
                            </TableRow>
                            {transports.map(transport => (
                                <TableRow key={transport}>
                                    <TableCell sx={{ paddingY: 0 }}><Transport transport={transport} /></TableCell>
                                    <TableCell sx={{ paddingY: 0, color: darkTheme ? 'white' : 'black', }}>
                                        <Typography variant="h6">{transportRepartition[transport]}</Typography>
                                        <Typography variant="body2">
                                            {percentage(transportRepartition[transport], clientsCount)}%
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </CardContent>
        </Card>
    );
}
import React from 'react';
import { useSelector } from 'react-redux';
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
import { Link } from 'react-router';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ServerStatus from '../ServerStatus';
import { percentage } from '../../util';

ChartJS.register(ArcElement, Tooltip);

export default function ServersOverview() {
    const { t } = useTranslation();
    const theme = useTheme();

    const servers = useSelector(state => state.servers.servers);
    const darkTheme = useSelector(state => state.config.darkTheme);

    const healthyServers = servers.filter(server => server.healthy).length;
    const totalServers = servers.length;

    const data = {
        labels: [t("servers.healthy"), t("servers.unhealthy")],
        datasets: [
            {
                backgroundColor: [theme.palette.success.main, theme.palette.error.main],
                borderColor: darkTheme ? theme.palette.common.black : theme.palette.common.white,
                data: [healthyServers, totalServers - healthyServers]
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
                title={t("servers.title")}
                action={
                    <Button
                        component={Link}
                        to="/servers"
                        size="small"
                        sx={{ minWidth: 0 }}
                    >
                        <MoreHorizIcon />
                    </Button>
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
                    //flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Box sx={{
                        maxWidth: 160,
                        margin: 2
                    }}>
                        <Doughnut data={data} options={chartOptions} />
                    </Box>

                    <Table size="small" sx={{ width: 'auto', flexGrow: 1, flexShrink: 0 }}>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ color: darkTheme ? 'white' : 'black' }}><Typography variant="subtitle2">{t("status")}</Typography></TableCell>
                                <TableCell sx={{ color: darkTheme ? 'white' : 'black' }}><Typography variant="subtitle2">#</Typography></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ paddingY: 0 }}><ServerStatus healthy /></TableCell>
                                <TableCell sx={{ paddingY: 0, color: darkTheme ? 'white' : 'black' }}>
                                    <Typography variant="h6">{healthyServers}</Typography>
                                    <Typography variant="body2">
                                        {percentage(healthyServers, totalServers)}%
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ paddingY: 0 }}><ServerStatus /></TableCell>
                                <TableCell sx={{ paddingY: 0, color: darkTheme ? 'white' : 'black' }}>
                                    <Typography variant="h6">{totalServers - healthyServers}</Typography>
                                    <Typography variant="body2">
                                        {percentage(totalServers - healthyServers, totalServers)}%
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </CardContent>
        </Card>
    );
}
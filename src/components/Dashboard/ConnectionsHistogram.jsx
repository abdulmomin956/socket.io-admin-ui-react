import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardContent } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, TimeScale, Tooltip, Legend } from 'chart.js';
import { subMinutes } from 'date-fns';
import 'chartjs-adapter-date-fns';

// Register ChartJS components
ChartJS.register(LinearScale, CategoryScale, BarElement, TimeScale, Tooltip, Legend);

export default function ConnectionsHistogram() {
    const { t } = useTranslation();
    const darkTheme = useSelector(state => state.config.darkTheme);
    const aggregatedEvents = useSelector(state => state.main.aggregatedEvents);
    const [chartOptions, setChartOptions] = useState({
        parsing: false,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    stepSize: 1,
                    unit: 'minute',
                },
                min: subMinutes(new Date(), 10),
                max: new Date(),
            },
            y: {
                type: 'linear',
                beginAtZero: true,
                suggestedMax: 10,
                ticks: {
                    precision: 0,
                },
            },
        },
    });

    // Filter and map events
    const mapAggregatedEvent = (event) => ({
        x: event.timestamp,
        y: event.count,
    });

    const connectionEvents = aggregatedEvents
        .filter(event => event.type === 'rawConnection')
        .map(mapAggregatedEvent);

    const disconnectionEvents = aggregatedEvents
        .filter(event => event.type === 'rawDisconnection')
        .map(mapAggregatedEvent);

    const chartData = {
        datasets: [
            {
                label: t('events.type.connection'),
                backgroundColor: '#4CAF50', // green.base equivalent
                data: connectionEvents,
            },
            {
                label: t('events.type.disconnection'),
                backgroundColor: '#F44336', // red.base equivalent
                data: disconnectionEvents,
            },
        ],
    };

    // Update chart bounds periodically
    useEffect(() => {
        const updateChartBounds = () => {
            const now = new Date();
            setChartOptions(prev => ({
                ...prev,
                scales: {
                    ...prev.scales,
                    x: {
                        ...prev.scales.x,
                        min: subMinutes(now, 10),
                        max: now,
                    },
                },
            }));
        };

        updateChartBounds();
        const interval = setInterval(updateChartBounds, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Card sx={{
            color: darkTheme ? 'white' : 'black',
            background: darkTheme ? 'rgb(30,30,30)' : 'white',
        }}>
            <CardHeader
                title={t('dashboard.connectionsHistogram.title')}
            />
            <CardContent>
                <div style={{ height: '200px', width: '100%' }}>
                    <Bar
                        data={chartData}
                        options={chartOptions}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
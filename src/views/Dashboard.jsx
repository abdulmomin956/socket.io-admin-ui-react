import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    Container,
    Breadcrumbs,
    Link,
    Typography,
    Grid2
} from '@mui/material';
import ClientsOverview from '../components/Dashboard/ClientsOverview';
import ServersOverview from '../components/Dashboard/ServersOverview';
import NamespacesOverview from '../components/Dashboard/NamespacesOverview';
import ConnectionsHistogram from '../components/Dashboard/ConnectionsHistogram';
import BytesHistogram from '../components/Dashboard/BytesHistogram';

export default function Dashboard() {
    const { t } = useTranslation();
    const darkTheme = useSelector(state => state.config.darkTheme);
    const hasAggregatedValues = useSelector(state =>
        state.config.supportedFeatures.includes("AGGREGATED_EVENTS")
    );

    const breadcrumbItems = [
        <Typography key="1" sx={{ color: 'gray' }}>
            {t('dashboard.title')}
        </Typography>
    ];

    return (
        <div>
            <Breadcrumbs sx={{ p: 2 }}>
                {breadcrumbItems}
            </Breadcrumbs>

            <Container maxWidth={false} sx={{ pt: 2 }}>
                <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
                        <ClientsOverview />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
                        <ServersOverview />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
                        <NamespacesOverview />
                    </Grid2>

                    {hasAggregatedValues && (
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <ConnectionsHistogram />
                        </Grid2>
                    )}

                    {hasAggregatedValues && (
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <BytesHistogram />
                        </Grid2>
                    )}
                </Grid2>
            </Container>
        </div>
    );
}
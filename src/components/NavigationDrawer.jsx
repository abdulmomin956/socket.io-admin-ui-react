import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    HomeOutlined,
    StartOutlined,
    TagOutlined,
    PersonOutline,
    CalendarTodayOutlined,
    Storage
} from '@mui/icons-material';
import LangSelector from './LangSelector';
import ThemeSelector from './ThemeSelector';
import ReadonlyToggle from './ReadonlyToggle';
import { toggleNavigationDrawer } from '../store/modules/config';

export default function NavigationDrawer() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const darkTheme = useSelector(state => state.config.darkTheme);
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const showNavigationDrawer = useSelector(state => state.config.showNavigationDrawer);
    //console.log(showNavigationDrawer)
    const developmentMode = useSelector(state => (
        state.config.supportedFeatures.includes("ALL_EVENTS") ||
        !state.config.supportedFeatures.includes("AGGREGATED_EVENTS")
    ));

    const toggleDrawer = () => {
        dispatch(toggleNavigationDrawer());
    };

    if (isLargeScreen) {
        if (!showNavigationDrawer) {
            dispatch(toggleNavigationDrawer());
        }
    }

    useEffect(() => {
        if (!isLargeScreen) {
            if (showNavigationDrawer) {
                dispatch(toggleNavigationDrawer());
            }
        }
    }, [isLargeScreen, dispatch])

    const items = developmentMode ? [
        {
            title: t('dashboard.title'),
            icon: <HomeOutlined />,
            path: '/'
        },
        {
            title: t('sockets.title'),
            icon: <StartOutlined />,
            path: '/sockets'
        },
        {
            title: t('rooms.title'),
            icon: <TagOutlined />,
            path: '/rooms'
        },
        {
            title: t('clients.title'),
            icon: <PersonOutline />,
            path: '/clients'
        },
        {
            title: t('events.title'),
            icon: <CalendarTodayOutlined />,
            path: '/events'
        },
        {
            title: t('servers.title'),
            icon: <Storage />,
            path: '/servers'
        }
    ] : [
        {
            title: t('dashboard.title'),
            icon: <HomeOutlined />,
            path: '/dashboard'
        },
        {
            title: t('servers.title'),
            icon: <Storage />,
            path: '/servers'
        }
    ];

    return (
        <Drawer
            style={{ zIndex: isLargeScreen ? 1000 : 9999 }}
            variant={isLargeScreen ? "permanent" : 'temporary'}
            // variant={"permanent"}
            // open={isLargeScreen ? true : showNavigationDrawer}
            open={showNavigationDrawer}
            onClose={toggleDrawer}
            sx={{
                width: showNavigationDrawer ? 240 : 0,

                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: showNavigationDrawer ? 240 : 0,
                    boxSizing: 'border-box',
                    boxShadow: 3,
                    background: darkTheme ? 'rgb(54,54,54)' : '',
                    color: darkTheme ? 'white' : '',
                    overflowX: 'hidden',
                    paddingTop: isLargeScreen ? '64px' : '',
                    transition: theme => theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                },
            }}
        >
            <List dense>
                {items.map((item) => (
                    <ListItem
                        key={item.title}
                        onClick={() => navigate(item.path)}
                        selected={window.location.pathname === item.path}
                        sx={{
                            cursor: 'pointer',
                            "&$selected": {
                                backgroundColor: "red",
                                color: "white",
                                "& .MuiListItemIcon-root": {
                                    color: "white"
                                }
                            },
                            "&$selected:hover": {
                                backgroundColor: "purple",
                                color: "white",
                                "& .MuiListItemIcon-root": {
                                    color: "white"
                                }
                            },
                            "&:hover": {
                                backgroundColor: "rgb(246, 246, 246)",
                                color: "rgba(0, 0, 0, .87)",
                                "& .MuiListItemIcon-root": {
                                    color: "rgba(0, 0, 0, .87)"
                                }
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: darkTheme ? 'white' : '' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.title} />
                    </ListItem>
                ))}
            </List>

            <Divider />

            <Box sx={{ p: 2, pt: 5 }}>
                <LangSelector />
                <ThemeSelector />
                <ReadonlyToggle />
            </Box>
        </Drawer>
    );
}
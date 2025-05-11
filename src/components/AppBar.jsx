import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    AppBar as MuiAppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    useMediaQuery,
    useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ConnectionStatus from './ConnectionStatus';
import LogoDark from '../assets/logo-dark.svg';
import LogoLight from '../assets/logo-light.svg';
import { version } from '../../package.json'
import { toggleNavigationDrawer } from '../store/modules/config';

// const version = import.meta.env.VITE_APP_VERSION;

export default function AppBar({ onUpdate }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    // console.log('isLaage', isLargeScreen)

    // Redux state
    const darkTheme = useSelector(state => state.config.darkTheme);
    const serverUrl = useSelector(state => state.connection.serverUrl);
    const connected = useSelector(state => state.connection.connected);

    // console.log(darkTheme)

    const linkToReleaseNotes = `https://github.com/abdulmomin956/socket.io-admin-ui-react/releases/tag/${version}`;

    const toggleDrawer = () => {
        dispatch(toggleNavigationDrawer());
    };


    return (
        <MuiAppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }} >
            <Toolbar sx={{
                background: darkTheme ? 'rgb(39,39,39)' : 'white',
            }}>
                {!isLargeScreen && (
                    <IconButton
                        edge="start"
                        onClick={toggleDrawer}
                        sx={{ mr: 2, color: darkTheme ? 'white' : 'black', }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                <img
                    src={darkTheme ? LogoDark : LogoLight}
                    alt="logo"
                    style={{
                        maxHeight: '40px',
                        maxWidth: '40px',
                        //filter: darkTheme ? 'invert(1)' : 'none'
                    }}
                />

                <Typography variant="h6" sx={{ ml: 2, color: darkTheme ? 'white' : 'black' }}>
                    Socket.IO Admin UI
                </Typography>

                <Button
                    size="small"
                    href={linkToReleaseNotes}
                    sx={{
                        ml: 1,
                        color: darkTheme ? 'white' : 'black',
                        background: darkTheme ? 'rgb(39,39,39)' : 'white',
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: 'none'
                        }
                    }}
                >
                    {version}
                </Button>

                <div style={{ flexGrow: 1 }} />

                {isLargeScreen && (
                    <div style={{ display: 'flex', alignItems: 'center', color: darkTheme ? 'white' : 'black', }}>
                        <div>
                            <div>
                                {t('connection.serverUrl')}{t('separator')}
                                {serverUrl && <code>{serverUrl}</code>}
                            </div>
                            <div>
                                {t('status')}{t('separator')}
                                <ConnectionStatus connected={connected} />
                            </div>
                        </div>

                        <Button
                            variant="outlined"
                            onClick={onUpdate}
                            sx={{
                                ml: 2,
                                alignSelf: 'center',
                                color: 'inherit',
                                borderColor: 'inherit',
                                '&:hover': {
                                    borderColor: 'inherit'
                                }
                            }}
                        >
                            {t('update')}
                        </Button>
                    </div>
                )}
            </Toolbar>

            {!isLargeScreen && (
                <Toolbar sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    py: 1,
                    backgroundColor: 'background.paper',
                    color: 'text.primary'
                }}>
                    <div style={{ marginTop: theme.spacing(1) }}>
                        {t('connection.serverUrl')}{t('separator')}
                        {serverUrl && <code>{serverUrl}</code>}
                    </div>
                    <div style={{
                        marginTop: theme.spacing(1),
                        marginBottom: theme.spacing(1),
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        {t('status')}{t('separator')}
                        <ConnectionStatus connected={connected} />
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={onUpdate}
                            sx={{ ml: 2 }}
                        >
                            {t('update')}
                        </Button>
                    </div>
                </Toolbar>
            )}
        </MuiAppBar>
    );
}
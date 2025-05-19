import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Switch as MuiSwitch,
    FormControlLabel,
    Select,
    MenuItem,
    Button,
    Collapse,
    Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ConnectionModal({
    isOpen,
    isConnecting,
    initialServerUrl,
    initialWsOnly,
    initialPath,
    initialNamespace,
    initialParser,
    error,
    onSubmit
}) {
    const { t } = useTranslation();
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const [serverUrl, setServerUrl] = useState(initialServerUrl || '');
    const [wsOnly, setWsOnly] = useState(initialWsOnly || false);
    const [path, setPath] = useState(initialPath || '/socket.io');
    const [namespace, setNamespace] = useState(initialNamespace || '/admin');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [parser, setParser] = useState(initialParser || 'default');

    const parserOptions = [
        { value: 'default', text: t('connection.default-parser') },
        { value: 'msgpack', text: t('connection.msgpack-parser') }
    ];

    useEffect(() => {
        // Reset form when modal opens
        if (isOpen) {
            setServerUrl(initialServerUrl || '');
            setWsOnly(initialWsOnly || false);
            setPath(initialPath || '/socket.io');
            setNamespace(initialNamespace || '/admin');
            setParser(initialParser || 'default');
            setUsername('');
            setPassword('');
        }
    }, [isOpen, initialServerUrl, initialWsOnly, initialPath, initialNamespace, initialParser]);

    const isValid = serverUrl && serverUrl.length;

    const errorMessage = error === 'invalid credentials'
        ? t('connection.invalid-credentials')
        : `${t('connection.error')}${t('separator')}${error}`;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            serverUrl,
            wsOnly,
            path,
            namespace,
            username,
            password,
            parser
        });
    };

    return (
        <Dialog
            open={isOpen}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        minWidth: 300
                    }
                }
            }}
        >
            <DialogTitle>{t('connection.title')}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label={t('connection.serverUrl')}
                        placeholder="https://example.com"
                        value={serverUrl}
                        onChange={(e) => setServerUrl(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />

                    <TextField
                        label={t('connection.username')}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label={t('connection.password')}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    <FormControlLabel
                        control={
                            <MuiSwitch
                                checked={showAdvancedOptions}
                                onChange={() => setShowAdvancedOptions(!showAdvancedOptions)}
                                size="small"
                            />
                        }
                        label={t('connection.advanced-options')}
                        sx={{ mt: 1 }}
                    />

                    <Collapse in={showAdvancedOptions}>
                        <FormControlLabel
                            control={
                                <MuiSwitch
                                    checked={wsOnly}
                                    onChange={() => setWsOnly(!wsOnly)}
                                    size="small"
                                />
                            }
                            label={t('connection.websocket-only')}
                            sx={{ mt: 1 }}
                        />

                        <TextField
                            label={t('connection.namespace')}
                            value={namespace}
                            onChange={(e) => setNamespace(e.target.value)}
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            label={t('connection.path')}
                            value={path}
                            onChange={(e) => setPath(e.target.value)}
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            select
                            label={t('connection.parser')}
                            value={parser}
                            onChange={(e) => setParser(e.target.value)}
                            fullWidth
                            margin="normal"
                        >
                            {parserOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.text}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Collapse>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={isConnecting || !isValid}
                    >
                        {isConnecting ? t('connection.connecting') : t('connection.connect')}
                    </Button>

                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {errorMessage}
                        </Typography>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
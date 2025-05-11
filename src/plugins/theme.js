import { createTheme } from '@mui/material/styles';

// Create a theme instance
const theme = createTheme({
    // Customize your theme here
    palette: {
        primary: {
            main: '#1976d2', // Example primary color
        },
        secondary: {
            main: '#9c27b0', // Example secondary color
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: 11
    },
    components: {
        // Component overrides can go here
        MuiButton: {
            defaultProps: {
                variant: 'contained',
            },
        },
    },
});

export default theme;
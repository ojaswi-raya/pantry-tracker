// app/ThemeProvider.js
'use client';

import { CssBaseline } from "@mui/material";
import { green, red, blue, orange } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import PropTypes from 'prop-types';

const theme = createTheme({
    palette: {
        primary: { main: blue[700] }, // Updated primary color
        secondary: { main: orange[700] }, // Updated secondary color
        error: { main: red[600] }, // Updated error color
        success: { main: green[600] }, // Updated success color
        background: { default: '#e0f7fa', paper: '#ffffff' }, // Updated background colors
        text: { primary: '#212121', secondary: '#757575' } // Updated text colors
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif', // Updated font family
        h1: {
            fontSize: '2rem', // Customize heading 1
            fontWeight: 700
        },
        h2: {
            fontSize: '1.75rem', // Customize heading 2
            fontWeight: 700
        },
        body1: {
            fontSize: '1rem', // Customize body text
            fontWeight: 400
        }
    },
    spacing: 8, // Update spacing to a different value
    shape: {
        borderRadius: 8, // Update border radius
    },
});

const ThemeProviderComponent = ({children}) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {children}
        </ThemeProvider>
    );
}

ThemeProviderComponent.propTypes = {
    children: PropTypes.node.isRequired
}

export default ThemeProviderComponent;

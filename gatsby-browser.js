/* eslint-disable import/prefer-default-export, react/prop-types */
import React from 'react';
import { SettingsProvider } from "./src/contexts/SettingsContext";
import useSettings from "./src/hooks/useSettings";
// import { THEMES } from "./src/constants";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from "./src/theme";
// import GlobalStyles from "./src/components/GlobalStyles";
// import { CacheProvider } from "@emotion/react";
// import createCache from "@emotion/cache";
import { SnackbarProvider } from "notistack";
import { Provider as ReduxProvider } from 'react-redux';
import store from './src/store';

// const cache = createCache({
//     key: "css",
//     prepend: true,
// });


function TopLayout(props) {
    const { settings } = useSettings();

    const theme = createTheme({
        direction: settings.direction,
        responsiveFontSizes: settings.responsiveFontSizes,
        theme: settings.theme,
        lang: settings.lang,
    });

    return (
        // <StyledEngineProvider injectFirst>
        <SettingsProvider>
            {/* <CacheProvider value={cache}> */}
            <ReduxProvider store={store}>
                <ThemeProvider theme={theme}>
                    <SnackbarProvider maxSnack={3}>
                        {/* <GlobalStyles /> */}
                        <CssBaseline />
                        {props.children}
                    </SnackbarProvider>
                </ThemeProvider>
            </ReduxProvider>
            {/* </CacheProvider> */}
        </SettingsProvider>
        // </StyledEngineProvider>
    );
}

export const wrapRootElement = ({ element }) => {
    return <TopLayout>{element}</TopLayout>;
};
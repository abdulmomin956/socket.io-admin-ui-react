import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { I18nextProvider } from "react-i18next"; // i18n for React
import { Provider } from "react-redux"; // Redux for state management
import { ThemeProvider } from "@mui/material/styles"; // Material-UI or Vuetify replacement
import store from "./store"; // Redux store
import i18n from "./i18n"; // i18n configuration
// import "./i18n"; // i18n configuration
import theme from "./plugins/theme"; // Theme configuration (replaces Vuetify)
import "./plugins/chartjs"; // Chart.js setup
import { initializeConfig } from "./store/modules/config";
import { initConnection } from "./store/modules/connection";
import './index.css'
//import router from "./router";

// Initialize Redux state
store.dispatch(initializeConfig());
store.dispatch(initConnection());

// Set i18n language from Redux store
const currentLang = store.getState().config.lang;
if (currentLang) {
  i18n.changeLanguage(currentLang);
}

// Update server state every second
setInterval(() => {
  store.dispatch({ type: "servers/updateState" });
}, 1000);

// Render the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  </React.StrictMode>
);
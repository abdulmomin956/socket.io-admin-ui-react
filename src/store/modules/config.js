import { isLocalStorageAvailable } from "../../util";

// Action Types
const INITIALIZE = "config/INITIALIZE";
const SELECT_THEME = "config/SELECT_THEME";
const SELECT_LANG = "config/SELECT_LANG";
const SET_READONLY = "config/SET_READONLY";
const UPDATE_CONFIG = "config/UPDATE_CONFIG";
const TOGGLE_NAVIGATION_DRAWER = "config/TOGGLE_NAVIGATION_DRAWER";

// Initial State
const initialState = {
    darkTheme: false,
    readonly: false,
    lang: "en",
    supportedFeatures: [],
    showNavigationDrawer: false,
};

// Reducer
export function configReducer(state = initialState, action) {
    switch (action.type) {
        case INITIALIZE:
            return { ...state, ...action.payload };
        case SELECT_THEME:
            return { ...state, darkTheme: action.payload };
        case SELECT_LANG:
            return { ...state, lang: action.payload };
        case SET_READONLY:
            return { ...state, readonly: action.payload };
        case UPDATE_CONFIG:
            return { ...state, supportedFeatures: action.payload.supportedFeatures };
        case TOGGLE_NAVIGATION_DRAWER:
            return { ...state, showNavigationDrawer: !state.showNavigationDrawer };
        default:
            return state;
    }
}

// Action Creators
export const initializeConfig = () => (dispatch) => {
    if (isLocalStorageAvailable) {
        dispatch({
            type: INITIALIZE,
            payload: {
                darkTheme: localStorage.getItem("dark_theme") === "true",
                readonly: localStorage.getItem("readonly") === "true",
                lang: localStorage.getItem("lang") || "en",
            },
        });
    }
};

export const selectTheme = (darkTheme) => (dispatch) => {
    if (isLocalStorageAvailable) {
        localStorage.setItem("dark_theme", darkTheme);
    }
    dispatch({ type: SELECT_THEME, payload: darkTheme });
};

export const selectLang = (lang) => (dispatch) => {
    if (isLocalStorageAvailable) {
        localStorage.setItem("lang", lang);
    }
    dispatch({ type: SELECT_LANG, payload: lang });
};

export const toggleReadonly = () => (dispatch, getState) => {
    const newReadonly = !getState().config.readonly;
    if (isLocalStorageAvailable) {
        localStorage.setItem("readonly", newReadonly);
    }
    dispatch({ type: SET_READONLY, payload: newReadonly });
};

export const updateConfig = (config) => ({
    type: UPDATE_CONFIG,
    payload: config,
});

// export const toggleNavigationDrawer = () => ({
//     type: TOGGLE_NAVIGATION_DRAWER,
// });
export const toggleNavigationDrawer = () => (dispatch) => {
    dispatch({ type: TOGGLE_NAVIGATION_DRAWER })
}

// Selectors
export const selectDevelopmentMode = (state) => {
    return (
        state.config.supportedFeatures.includes("ALL_EVENTS") ||
        !state.config.supportedFeatures.includes("AGGREGATED_EVENTS")
    );
};

export const selectHasAggregatedValues = (state) => {
    return state.config.supportedFeatures.includes("AGGREGATED_EVENTS");
};
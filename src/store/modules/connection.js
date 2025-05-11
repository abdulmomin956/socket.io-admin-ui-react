import { isLocalStorageAvailable } from "../../util";

// Action Types
const CONNECTION_INIT = "connection/INIT";
const SAVE_CONFIG = "connection/SAVE_CONFIG";
const SAVE_SESSION_ID = "connection/SAVE_SESSION_ID";
const CONNECT = "connection/CONNECT";
const DISCONNECT = "connection/DISCONNECT";

// Initial State
const initialState = {
    serverUrl: "",
    wsOnly: false,
    path: "/socket.io",
    namespace: "/admin",
    parser: "default",
    sessionId: "",
    connected: false,
};

// Reducer
export function connectionReducer(state = initialState, action) {
    switch (action.type) {
        case CONNECTION_INIT:
            return { ...state, ...action.payload };
        case SAVE_CONFIG:
            return { ...state, ...action.payload };
        case SAVE_SESSION_ID:
            return { ...state, sessionId: action.payload };
        case CONNECT:
            return { ...state, connected: true };
        case DISCONNECT:
            return { ...state, connected: false };
        default:
            return state;
    }
}

// Action Creators
export const initConnection = () => {
    let payload = initialState;

    if (isLocalStorageAvailable) {
        let serverUrl = localStorage.getItem("server_url") || "";
        let namespace = "/admin";

        if (serverUrl.endsWith("/admin")) {
            serverUrl = serverUrl.slice(0, -6);
        } else {
            namespace = localStorage.getItem("namespace") || "/admin";
        }

        payload = {
            serverUrl,
            wsOnly: localStorage.getItem("ws_only") === "true",
            path: localStorage.getItem("path") || "/socket.io",
            namespace,
            parser: localStorage.getItem("parser") || "default",
            sessionId: localStorage.getItem("session_id") || "",
        };
    }

    return { type: CONNECTION_INIT, payload };
};

export const saveConfig = (config) => (dispatch) => {
    const { serverUrl, wsOnly, path, namespace, parser } = config;

    if (isLocalStorageAvailable) {
        localStorage.setItem("server_url", serverUrl);
        localStorage.setItem("ws_only", wsOnly);
        localStorage.setItem("path", path);
        localStorage.setItem("namespace", namespace);
        localStorage.setItem("parser", parser);
    }

    dispatch({ type: SAVE_CONFIG, payload: config });
};

export const saveSessionId = (sessionId) => (dispatch) => {
    if (isLocalStorageAvailable) {
        localStorage.setItem("session_id", sessionId);
    }
    dispatch({ type: SAVE_SESSION_ID, payload: sessionId });
};

export const connect = () => ({ type: CONNECT });
export const disconnect = () => ({ type: DISCONNECT });

// Selectors
export const selectConnectionState = (state) => state.connection;
export const selectServerUrl = (state) => state.connection.serverUrl;
export const selectIsConnected = (state) => state.connection.connected;
export const selectSessionId = (state) => state.connection.sessionId;
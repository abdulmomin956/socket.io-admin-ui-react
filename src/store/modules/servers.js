import { find, merge } from "lodash-es";
import { remove } from "../../util";

const HEALTHY_THRESHOLD = 10000;

// Action Types
const SERVER_STATS = "servers/SERVER_STATS";
const REMOVE_SERVER = "servers/REMOVE_SERVER";
const UPDATE_STATE = "servers/UPDATE_STATE";

// Initial State
const initialState = {
    servers: [],
};

// Reducer
export function serversReducer(state = initialState, action) {
    switch (action.type) {
        case SERVER_STATS: {
            const stats = { ...action.payload, lastPing: Date.now() };
            const server = find(state.servers, { serverId: stats.serverId });

            if (server) {
                return {
                    ...state,
                    servers: state.servers.map(s =>
                        s.serverId === stats.serverId ? merge({}, s, stats) : s
                    )
                };
            } else {
                return {
                    ...state,
                    servers: [...state.servers, { ...stats, healthy: true }]
                };
            }
        }

        case REMOVE_SERVER: {
            return {
                ...state,
                servers: state.servers.filter(
                    server => server.serverId !== action.payload
                )
            };
        }

        case UPDATE_STATE: {
            return {
                ...state,
                servers: state.servers.map(server => ({
                    ...server,
                    healthy: Date.now() - server.lastPing < HEALTHY_THRESHOLD
                }))
            };
        }

        default:
            return state;
    }
}

// Action Creators
export const onServerStats = (stats) => ({
    type: SERVER_STATS,
    payload: stats
});

export const removeServer = (serverId) => ({
    type: REMOVE_SERVER,
    payload: serverId
});

export const updateState = () => ({
    type: UPDATE_STATE
});

// Selectors
export const selectServers = (state) => state.servers.servers;

export const selectNamespaces = (state) => {
    const namespaces = {};
    for (const server of state.servers.servers) {
        if (server.namespaces) {
            for (const { name, socketsCount } of server.namespaces) {
                namespaces[name] = (namespaces[name] || 0) + socketsCount;
            }
        }
    }
    return Object.keys(namespaces).map((name) => ({
        name,
        socketsCount: namespaces[name]
    }));
};

export const selectHealthyServers = (state) =>
    state.servers.servers.filter(server => server.healthy);
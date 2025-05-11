import { createSelector } from 'reselect';

// Base selector - just gets the servers array from state
const getServers = state => state.servers.servers;

// Memoized selector for lite namespaces
export const getLiteNamespaces = createSelector(
    [getServers],
    (servers) => {
        const namespaces = {};

        // Aggregate namespace data across all servers
        for (const server of servers) {
            if (server.namespaces) {
                for (const { name, socketsCount } of server.namespaces) {
                    namespaces[name] = (namespaces[name] || 0) + socketsCount;
                }
            }
        }

        // Transform to array format
        return Object.keys(namespaces).map(name => ({
            name,
            socketsCount: namespaces[name]
        }));
    }
);
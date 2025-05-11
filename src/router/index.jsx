// src/router/index.jsx
import { createHashRouter } from 'react-router';
import Dashboard from '../views/Dashboard';
// import Sockets from '../views/Sockets';
// import Socket from '../views/Socket';
// import Rooms from '../views/Rooms';
// import Clients from '../views/Clients';
// import Client from '../views/Client';
// import Servers from '../views/Servers';
// import Room from '../views/Room';
// import Events from '../views/Events';
import App from '../App';

const router = createHashRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Dashboard />,
                handle: {
                    meta: {
                        topLevel: true,
                        index: 0
                    }
                }
            },
            // {
            //     path: 'sockets',
            //     element: <Sockets />,
            //     handle: {
            //         meta: {
            //             topLevel: true,
            //             index: 1
            //         }
            //     }
            // },
            // {
            //     path: 'n/:nsp/sockets/:id',
            //     element: <Socket />,
            //     handle: {
            //         meta: {
            //             topLevel: false
            //         }
            //     }
            // },
            // {
            //     path: 'rooms',
            //     element: <Rooms />,
            //     handle: {
            //         meta: {
            //             topLevel: true,
            //             index: 2
            //         }
            //     }
            // },
            // {
            //     path: 'n/:nsp/rooms/:name',
            //     element: <Room />,
            //     handle: {
            //         meta: {
            //             topLevel: false
            //         }
            //     }
            // },
            // {
            //     path: 'clients',
            //     element: <Clients />,
            //     handle: {
            //         meta: {
            //             topLevel: true,
            //             index: 3
            //         }
            //     }
            // },
            // {
            //     path: 'clients/:id',
            //     element: <Client />,
            //     handle: {
            //         meta: {
            //             topLevel: false
            //         }
            //     }
            // },
            // {
            //     path: 'events',
            //     element: <Events />,
            //     handle: {
            //         meta: {
            //             topLevel: true,
            //             index: 4
            //         }
            //     }
            // },
            // {
            //     path: 'servers',
            //     element: <Servers />,
            //     handle: {
            //         meta: {
            //             topLevel: true,
            //             index: 5
            //         }
            //     }
            // }
        ]
    }
]);

export default router;
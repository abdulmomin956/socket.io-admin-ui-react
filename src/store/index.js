import logger from 'redux-logger';
import { configReducer } from './modules/config';
import { connectionReducer } from './modules/connection';
import mainReducer from './modules/mainSlice';
import { serversReducer } from './modules/servers';
import { configureStore } from '@reduxjs/toolkit';


// Create Redux store
const store = configureStore({
    reducer: {
        config: configReducer,
        connection: connectionReducer,
        main: mainReducer,
        servers: serversReducer
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    //     immutableCheck: false,
    //     serializableCheck: false,
    // })
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware().concat(logger),
});

export default store;
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer  from './user/userSlice';
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistStore from 'redux-persist/es/persistStore';

//combining reducers
const rootReducer = combineReducers({
    user: userReducer,

});

//here redux-persist is used to save the state in persistent storage so that even after a refresh, the data will remain intact
const persistConfig = {
    key: 'root',
    storage,
    version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    //prevent possible errors using redux toolkit
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false}),
});

export const persistor = persistStore(store);
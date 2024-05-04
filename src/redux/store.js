import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import addUserReducer from './addUserSlice';
import userDetailsReducer from './userDetailsSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        users: userDetailsReducer,
        addUser: addUserReducer,
    },
});

export default store;

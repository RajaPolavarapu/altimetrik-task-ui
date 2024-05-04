import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import constants from "./constants"

export const loginUser = createAsyncThunk(
    constants.login,
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/login', { username, password });
            if (response.status === 200) {
                return response.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue("Invalid Credentials");
        }
    }
);


export const logoutUser = createAsyncThunk(
    constants.logoutUser,
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/logout');
            if (response.status === 200) {
                localStorage.setItem("jwtToken");
                return response.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue("Unable to Fetch Users");
        }
    }
);

export const refreshSession = createAsyncThunk(
    constants.refreshSession,
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("jwtToken");
        try {
            const response = await axios.post('/api/validate', { token });
            if (response.status === 200) {
                return response.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue("Unable to Fetch Users");
        }
    }
);

const initialState = {
    isLoading: true,
    isAuthenticated: false,
    token: null,
    error: null,
    tokenExpired: false,
    loggedOut: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetLoginState(state) {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.token = null;
            state.error = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                localStorage.setItem("jwtToken", action.payload.token)
                state.error = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.error = action.payload;
            })
            //Session Update
            .addCase(refreshSession.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(refreshSession.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.tokenExpired = false;
                state.error = false;
            })
            .addCase(refreshSession.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.tokenExpired = true;
                state.token = null;
                localStorage.setItem("jwtToken", undefined)
                state.error = false;
            })
            //Logout User
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.loggedOut = true;
                localStorage.setItem("jwtToken", null)
                state.error = false;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.token = null;
                localStorage.setItem("jwtToken", null)
                state.error = false;
            });
    },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;

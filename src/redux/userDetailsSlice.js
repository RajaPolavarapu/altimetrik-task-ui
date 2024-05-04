import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import constants from './constants';
import axios from 'axios';

const initialState = {
    users: [],
    error: null,
    status: null,
    unauthorized: false
};

export const updateUser = createAsyncThunk(
    constants.updateUser,
    async (user, { rejectWithValue }) => {
        const token = localStorage.getItem("jwtToken");
        try {
            const response = await axios.post('/api/update', { token, user });
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


export const getUsers = createAsyncThunk(
    constants.userDetails,
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("jwtToken");
        try {
            const response = await axios.post('/api/getusers', { token });
            if (response.status === 200) {
                return response.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue({
                status: error.response.status,
                message: "Unable to Fetch Users"
            });
        }
    }
);

const userDetailsSlice = createSlice({
    name: 'userDetails',
    initialState,
    reducers: {
        setError(state, action) {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
                state.error = false;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.unauthorized = action.payload.status === 401;
                state.isLoading = false;
                state.users = [];
                state.error = action.payload;
            })
            // Update User
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
                state.error = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.status = action.payload;
            });

    },
});

export const { setError } = userDetailsSlice.actions;

export default userDetailsSlice.reducer;

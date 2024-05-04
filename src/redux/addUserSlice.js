import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import constants from './constants';
import axios from 'axios';

const initialState = {
    status: null,
    isLoading: true,
    error: null,
};

export const addUser = createAsyncThunk(
    constants.addUser,
    async (user, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/register', user);
            console.log(user)
            if (response.status === 200) {
                return response.data;
            } else {
                return rejectWithValue(response.status);
            }
        } catch (error) {
            return rejectWithValue(error.response.data.status || "Unable to Create User");
        }
    }
);

const addUserSlice = createSlice({
    name: 'addUser',
    initialState,
    reducers: {
        addUserFailure(state, action) {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.status = "success";
                state.message = action.payload.status;
                state.error = false;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.isLoading = false;
                state.status = "failed";
                state.message = action.payload;
                state.error = action.payload;
            });
    },
});

export const { addUserFailure } = addUserSlice.actions;

export default addUserSlice.reducer;

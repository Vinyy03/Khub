import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching users...');
      // This is the correct endpoint matching your route setup
      const response = await axiosInstance.get('/api/v1/users');
      console.log('Users fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);

export const deleteUserById = createAsyncThunk(
  'users/deleteUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/v1/users/delete/${userId}`);
      return userId;
    } catch (error) {
      console.error('Error deleting user:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete user'
      );
    }
  }
);

const initialState = {
  users: [],
  isLoading: false,
  error: null,
  deleteLoading: false,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users reducers
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data || [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch users';
      })
      
      // Delete user reducers
      .addCase(deleteUserById.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload || 'Failed to delete user';
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
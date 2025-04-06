import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import axiosInstance from '../../utils/axiosConfig';
import { uploadImageToCloudinary } from '../../utils/imageUpload';

// Base URL from environment variable
const baseURL = API_URL || 'http://192.168.1.64:5000';

// Update the registerUser function to handle Cloudinary image upload
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // If there's a profile image, upload it to Cloudinary first
      let profileImageUrl = null;
      if (userData.profileImage) {
        profileImageUrl = await uploadImageToCloudinary(userData.profileImage);
      }
      
      // Create user data with Cloudinary image URL if available
      const userDataToSend = {
        ...userData,
        profileImage: profileImageUrl || '',
      };
      
      // Register the user with the Cloudinary image URL
      const response = await axios.post(`${baseURL}/api/v1/auth/register`, userDataToSend);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  }
);

// Also update the loginUser function to use axiosInstance
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/v1/auth/login', {
        email,
        password
      });

      // Store token in AsyncStorage for persistence
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data));

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      // Upload image to Cloudinary if a new one is provided
      if (userData.profileImage && !userData.profileImage.startsWith('http')) {
        const cloudinaryUrl = await uploadImageToCloudinary(userData.profileImage);
        userData.profileImage = cloudinaryUrl;
      }
      
      const response = await axiosInstance.put('/api/v1/auth/update-profile', userData);

      // Update the stored user data
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data));

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    }
  }
);

// Check for existing token when app loads
export const checkAuthStatus = createAsyncThunk(
  'auth/status',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');

      if (token && userData) {
        return {
          token,
          data: JSON.parse(userData)
        };
      }

      return null;
    } catch (error) {
      return rejectWithValue('Failed to restore authentication state');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    return null;
  }
);

// Initial state
const initialState = {
  user: null,
  token: null,
  isLoggedIn: false,
  isAdmin: false,
  isLoading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.user = action.payload.data;
        state.isAdmin = action.payload.data.isAdmin;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Check auth status cases
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.data;
          state.isLoggedIn = true;
          state.isAdmin = action.payload.data.isAdmin;
        }
      })

      // Logout case
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
        state.isAdmin = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
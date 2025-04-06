import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

// Get all categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/categories');
      return response.data.categories;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch categories.'
      );
    }
  }
);

// Get a single category by id
export const fetchCategoryById = createAsyncThunk(
  'categories/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/categories/${id}`);
      return response.data.category;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch category.'
      );
    }
  }
);

// Create a new category
export const createCategory = createAsyncThunk(
  'categories/create',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/v1/categories', categoryData);
      return response.data.category;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create category.'
      );
    }
  }
);

// Update a category
export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/v1/categories/${id}`, categoryData);
      return response.data.category;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update category.'
      );
    }
  }
);

// Delete a category
export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/v1/categories/${id}`);
      return id; // Return the id to remove it from state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete category.'
      );
    }
  }
);

// Initial state
const initialState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
};

// Category slice
const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch single category
      .addCase(fetchCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.categories.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.currentCategory = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = state.categories.filter(c => c._id !== action.payload);
        if (state.currentCategory && state.currentCategory._id === action.payload) {
          state.currentCategory = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryError, clearCurrentCategory } = categorySlice.actions;
export default categorySlice.reducer;
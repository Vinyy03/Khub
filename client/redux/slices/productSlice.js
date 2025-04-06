import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

// Fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/products');
      return response.data.products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products.'
      );
    }
  }
);

// Fetch a single product by id
export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/products/${id}`);
      return response.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product.'
      );
    }
  }
);

// Create a new product
export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      // Handle form data for image upload
      const formData = new FormData();
      
      // Add image if available
      if (productData.image && !productData.image.startsWith('http')) {
        const uriParts = productData.image.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('image', {
          uri: productData.image,
          name: `product.${fileType}`,
          type: `image/${fileType}`,
        });
      }
      
      // Add other fields
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price.toString());
      
      // Add categories (if array, convert to comma-separated string)
      if (productData.categories) {
        if (Array.isArray(productData.categories)) {
          formData.append('categories', productData.categories.join(','));
        } else {
          formData.append('categories', productData.categories);
        }
      }
      
      const response = await axiosInstance.post('/api/v1/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.newProduct;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create product.'
      );
    }
  }
);

// Update a product
export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      // Handle form data for image upload
      const formData = new FormData();
      
      // Add image if it's a new file (not a URL)
      if (productData.image && !productData.image.startsWith('http')) {
        const uriParts = productData.image.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('image', {
          uri: productData.image,
          name: `product.${fileType}`,
          type: `image/${fileType}`,
        });
      }
      
      // Add other fields
      if (productData.name !== undefined) formData.append('name', productData.name);
      if (productData.description !== undefined) formData.append('description', productData.description);
      if (productData.price !== undefined) formData.append('price', productData.price.toString());
      
      // Add categories (if array, convert to comma-separated string)
      if (productData.categories !== undefined) {
        if (Array.isArray(productData.categories)) {
          formData.append('categories', productData.categories.join(','));
        } else {
          formData.append('categories', productData.categories);
        }
      }
      
      const response = await axiosInstance.put(`/api/v1/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.updatedProduct;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update product.'
      );
    }
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/v1/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete product.'
      );
    }
  }
);

// Initial state
const initialState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
};

// Create the product slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products cases
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch single product cases
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create product cases
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update product cases
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        // Replace the old product with the updated one
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.currentProduct = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete product cases
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted product
        state.products = state.products.filter(product => product._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
  },
});

export const { clearProductError, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
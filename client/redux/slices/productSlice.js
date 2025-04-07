import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';
import { cloudinaryConfig, CLOUDINARY_URL } from '../../utils/cloudinaryConfig';

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
      console.log('Creating product with data:', productData);
      
      let imageUrl = productData.image;
      
      // Upload image to Cloudinary first if it's a local file
      if (productData.image && !productData.image.startsWith('http')) {
        console.log('Uploading image to Cloudinary:', productData.image);
        
        const formData = new FormData();
        const uriParts = productData.image.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        // Append required Cloudinary parameters
        formData.append('file', {
          uri: productData.image,
          name: `product-${Date.now()}.${fileType}`,
          type: `image/${fileType}`,
        });
        formData.append('upload_preset', cloudinaryConfig.uploadPreset);
        formData.append('cloud_name', cloudinaryConfig.cloudName);
        formData.append('api_key', cloudinaryConfig.apiKey);
        
        // Upload to Cloudinary
        const uploadResponse = await fetch(CLOUDINARY_URL, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        });
        
        const uploadResult = await uploadResponse.json();
        if (uploadResponse.ok) {
          imageUrl = uploadResult.secure_url;
          console.log('Image uploaded to Cloudinary:', imageUrl);
        } else {
          console.error('Cloudinary upload failed:', uploadResult);
          return rejectWithValue('Failed to upload image: ' + (uploadResult.error?.message || 'Unknown error'));
        }
      }
      
      // Now create product with FormData instead of JSON
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price.toString());
      formData.append('image', imageUrl); // Send the Cloudinary URL
      
      // Add categories
      if (Array.isArray(productData.categories)) {
        formData.append('categories', productData.categories.join(','));
      } else if (productData.categories) {
        formData.append('categories', productData.categories);
      }
      
      console.log('Sending product data to API with image URL:', imageUrl);
      
      const response = await axiosInstance.post('/api/v1/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Product created successfully:', response.data);
      return response.data.newProduct;
    } catch (error) {
      console.error('Create product error:', error);
      console.error('Error response:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create product.'
      );
    }
  }
);

// Update a product
// Update a product
export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      console.log('Updating product with data:', productData);
      
      let imageUrl = productData.image;
      
      // Upload image to Cloudinary first if it's a local file
      if (productData.image && !productData.image.startsWith('http')) {
        console.log('Uploading image to Cloudinary for update:', productData.image);
        
        const formData = new FormData();
        const uriParts = productData.image.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        // Append required Cloudinary parameters
        formData.append('file', {
          uri: productData.image,
          name: `product-${Date.now()}.${fileType}`,
          type: `image/${fileType}`,
        });
        formData.append('upload_preset', cloudinaryConfig.uploadPreset);
        formData.append('cloud_name', cloudinaryConfig.cloudName);
        formData.append('api_key', cloudinaryConfig.apiKey);
        
        // Upload to Cloudinary
        const uploadResponse = await fetch(CLOUDINARY_URL, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        });
        
        const uploadResult = await uploadResponse.json();
        if (uploadResponse.ok) {
          imageUrl = uploadResult.secure_url;
          console.log('Image uploaded to Cloudinary for update:', imageUrl);
        } else {
          console.error('Cloudinary upload failed:', uploadResult);
          return rejectWithValue('Failed to upload image: ' + (uploadResult.error?.message || 'Unknown error'));
        }
      }
      
      // Now create form data for the API request
      const formData = new FormData();
      
      // Add all fields to the form data
      if (productData.name !== undefined) formData.append('name', productData.name);
      if (productData.description !== undefined) formData.append('description', productData.description);
      if (productData.price !== undefined) formData.append('price', productData.price.toString());
      
      // Send the Cloudinary URL or existing URL as image
      if (imageUrl) {
        formData.append('image', imageUrl);
      }
      
      // Add categories (if array, convert to comma-separated string)
      if (productData.categories !== undefined) {
        if (Array.isArray(productData.categories)) {
          formData.append('categories', productData.categories.join(','));
        } else {
          formData.append('categories', productData.categories);
        }
      }
      
      console.log('Sending product update data to API with image URL:', imageUrl);
      
      const response = await axiosInstance.put(`/api/v1/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Product updated successfully:', response.data);
      return response.data.updatedProduct;
    } catch (error) {
      console.error('Update product error:', error);
      console.error('Error response:', error.response?.data);
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
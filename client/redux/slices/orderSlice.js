import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

// Create a new order
export const createOrder = createAsyncThunk(
    'order/create',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/api/v1/orders', orderData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create order'
            );
        }
    }
);

// Get user orders
export const getUserOrders = createAsyncThunk(
    'order/getUserOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/v1/orders/user');
            console.log('Orders API response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch orders'
            );
        }
    }
);

// Get all orders (admin only)
export const getAllOrders = createAsyncThunk(
    'order/getAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/v1/orders/admin');
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch orders'
            );
        }
    }
);

// Update order status (admin only)
// Update the updateOrderStatus thunk to better handle errors
export const updateOrderStatus = createAsyncThunk(
    'order/updateStatus',
    async ({ orderId, status }, { rejectWithValue }) => {
      try {
        console.log(`Sending request to update order ${orderId} to ${status}`);
        const response = await axiosInstance.patch(`/api/v1/orders/${orderId}/status`, { status });
        console.log('Update order status response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Update order status error:', error.response?.data || error.message);
        return rejectWithValue(
          error.response?.data?.message || 
          error.response?.data || 
          error.message || 
          'Failed to update order status'
        );
      }
    }
  );

const initialState = {
    orders: [],
    currentOrder: null,
    isLoading: false,
    updateLoading: false,
    success: false,
    error: null,
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearOrderSuccess: (state) => {
            state.success = false;
        },
        clearOrderError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create order cases
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentOrder = action.payload.order;
                state.success = true;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Get user orders cases
            .addCase(getUserOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload.orders || action.payload || [];
            })
            .addCase(getUserOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Get all orders (admin) cases
            .addCase(getAllOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload.orders || action.payload || [];
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Update order status cases
            .addCase(updateOrderStatus.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.updateLoading = false;
                // Update the order in the orders array
                const updatedOrder = action.payload.order;
                state.orders = state.orders.map(order => 
                    order._id === updatedOrder._id ? updatedOrder : order
                );
                state.success = true;
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearOrderSuccess, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
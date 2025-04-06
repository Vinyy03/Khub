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
// Update the getUserOrders function
export const getUserOrders = createAsyncThunk(
    'order/getUserOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/v1/orders/user');

            // Debug logging
            console.log('Orders API response:', response.data);

            // Return the data in the expected format
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch orders'
            );
        }
    }
);


const initialState = {
    orders: [],
    currentOrder: null,
    isLoading: false,
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
                // Check what structure the API returns
                state.orders = action.payload.orders || action.payload || [];
            })
            .addCase(getUserOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearOrderSuccess, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
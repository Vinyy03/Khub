import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice'; // Add import
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    products: productReducer, 
    order: orderReducer,
    users: userReducer,// Add product reducer
    // Add other reducers here as your app grows
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getOrders, 
    deleteOrder, 
    getUserOrder, 
    getMonthlyIncome,
    updateOrderStatus // Add this controller
} = require('../controllers/order.controller');
const { verifyAdmin, verifyToken } = require('../middleware/verifyToken');

// Create a new order
router.post('/', verifyToken, createOrder);

// Get all orders (admin only)
router.get('/', verifyAdmin, getOrders);

// Get all orders (admin only) - additional route for admin dashboard
router.get('/admin', verifyAdmin, getOrders);

// Get user's orders
router.get('/user', verifyToken, getUserOrder);

// Get specific order
router.get('/:id', verifyToken, getUserOrder);

// Update order status (admin only)
router.patch('/:id/status', verifyAdmin, updateOrderStatus);

// Delete order
router.delete('/:id', verifyToken, deleteOrder);

// Get monthly income statistics (admin only)
router.get('/stats/income', verifyAdmin, getMonthlyIncome);

module.exports = router;
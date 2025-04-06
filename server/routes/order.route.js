const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getOrders, 
    deleteOrder, 
    getUserOrder, 
    getMonthlyIncome 
} = require('../controllers/order.controller');
const { verifyAdmin, verifyToken } = require('../middleware/verifyToken');

// Create a new order
router.post('/', verifyToken, createOrder);

// Get all orders (admin only)
router.get('/', verifyAdmin, getOrders);

// Get user's orders
router.get('/user', verifyToken, getUserOrder);

// Get specific order
router.get('/:id', verifyToken, getUserOrder);


// Delete order
router.delete('/:id', verifyToken, deleteOrder);

// Get monthly income statistics (admin only)
router.get('/stats/income', verifyAdmin, getMonthlyIncome);

module.exports = router;
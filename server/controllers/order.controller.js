const Order = require("../models/order.model.js");


const createOrder = async (req, res) => {
    try {
        // Extract user ID from JWT token
        const userId = req.user.userId;
        
        // Get order data from request body
        const { items, amount, address, paymentMethod } = req.body;
        
        // Validate input
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Order must contain items" });
        }
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid order amount" });
        }
        
        if (!address) {
            return res.status(400).json({ message: "Shipping address is required" });
        }
        
        // Create new order
        const newOrder = new Order({
            userId,
            items,
            amount,
            address,
            paymentMethod: paymentMethod || 'cash',
            status: 'pending'
        });
        
        // Save the order
        await newOrder.save();
        
        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: newOrder
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Error creating order",
            error: error.message
        });
    }
};


const deleteOrder = async (req, res) => {
    try {
       await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({
        message: "Order deleted successfully",
    })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error deleting Order",
            error: error.message,
        });
        
    }
};

// Update getUserOrder function
const getUserOrder = async (req, res) => {
    try {
      // Get the user ID from the authenticated request
      const userId = req.user.userId;
      
      // Find all orders for this user
      const orders = await Order.find({ userId }).sort({ createdAt: -1 });
      
      // Return the orders
      res.status(200).json({
        message: "Orders retrieved successfully",
        orders: orders
      });
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({
        message: "Error fetching orders",
        error: error.message
      });
    }
  };

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json({
            message: "Orders fetched successfully",
            orders,
        });
        } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching Orders",
            error: error.message,
        });
        
    }
};

const getMonthlyIncome = async (req, res) => {
    try {
        const date = new Date();
        const LastMonth = new Date(date.setMonth(date.getMonth() - 1));
        const prevMonth = new Date(
            new Date(LastMonth.setMonth(LastMonth.getMonth() - 1))
        );

        const monthlyIncome = await Order.aggregate([
            {
                $match: { createdAt: {$gte: prevMonth } },
            },{
                $project: {
                    month: {$month : "$createdAt"},
                    sales: "$amount",
                },
            }, {
                $group: {
                    _id: "$month",
                    total: {$sum: "$sales"},
                },
            },
        ]);

        res.status(200).json({
            message: "Monthly Income fetched successfully",
            monthlyIncome,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching User Monthly Income",
            error: error.message,
        });
        
    }
}

module.exports = {
    createOrder,
    deleteOrder,
    getUserOrder,
    getOrders,
    getMonthlyIncome,
};
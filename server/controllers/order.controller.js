const Order = require("../models/order.model.js");


const createOrder = async (req, res) => {

    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(200).json({
            message: "Order created successfully",
            newOrder,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error creating Order",
            error: error.message,
        });
    }
};

const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, 
        {
            $set: req.body,
        },
        {
            new: true,
        }
    );
    res.status(200).json({
        message: "Order updated successfully",
        updatedCart,
    })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error updating Order",
            error: error.message,
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

const getUserOrder = async (req, res) => {
    try {
        const order = await Order.findOne({userId: req.params.id});
        res.status(200).json({
            message: "Order fetched successfully",
            order,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching Order",
            error: error.message,
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
    updateOrder,
    deleteOrder,
    getUserOrder,
    getOrders,
    getMonthlyIncome,
};
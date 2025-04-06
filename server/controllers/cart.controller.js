const Cart = require("../models/cart.model.js");


const createCart = async (req, res) => {

    try {
        const newCart = new Cart(req.body);
        await newCart.save();
        res.status(200).json({
            message: "Cart created successfully",
            newCart,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error creating Cart",
            error: error.message,
        });
    }
};

const updateCart = async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id, 
        {
            $set: req.body,
        },
        {
            new: true,
        }
    );
    res.status(200).json({
        message: "Cart updated successfully",
        updatedCart,
    })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error updating Cart",
            error: error.message,
        });
        
    }
};


const deleteCart = async (req, res) => {
    try {
       await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({
        message: "Cart deleted successfully",
    })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error deleting Cart",
            error: error.message,
        });
        
    }
};

const getUserCartItem = async (req, res) => {
    try {
        const cartItem = await Cart.findOne({userId: req.params.id});
        res.status(200).json({
            message: "Cart fetched successfully",
            cartItem,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching Cart",
            error: error.message,
        });
    }
};

const getCartItems = async (req, res) => {
    try {
        const cartItems = await Cart.find();
        res.status(200).json({
            message: "Cart Items fetched successfully",
            cartItems,
        });
        } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching Cart Items",
            error: error.message,
        });
        
    }
};

module.exports = {
    createCart,
    updateCart,
    deleteCart,
    getUserCartItem,
    getCartItems,
};
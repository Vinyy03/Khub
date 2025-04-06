const mongoose = require('mongoose');
const { Schema } = mongoose;

const productModel = new Schema({
    name: {
        type: String,
        required: true,
    },
    title: {  // Add this back for compatibility with existing DB index
        type: String,
        unique: true,
        sparse: true, // Allows multiple null values
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    categories: {
        type: Array,
        default: [],
    },
    price: {
        type: Number,
        required: true,
    },
},   
{ 
    timestamps: true 
});

module.exports = mongoose.model('Product', productModel);
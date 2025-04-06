const mongoose = require('mongoose');
const { Schema } = mongoose;

const productModel = new Schema({
    name: { // Changed from 'title' to 'name' to match ProductDetailScreen.js
        type: String,
        required: true,
        unique: true,
    },
    description: { // Changed from 'desc' to 'description' to match ProductDetailScreen.js
        type: String,
        required: true,
    },
    image: { // Changed from 'images' to 'image' to match ProductDetailScreen.js
        type: String,
        required: true, // Uncommented to ensure it's mandatory
    },
    categories: {
        type: Array,
        default: [],
    },
    price: {
        type: Number,
        required: true, // Added required to ensure price is mandatory
    },
},   
{ 
    timestamps: true 
});

module.exports = mongoose.model('Product', productModel);
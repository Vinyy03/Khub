const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: '',
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', categorySchema);
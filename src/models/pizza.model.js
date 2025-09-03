const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // e.g., 'Small', 'Medium', 'Large'
        enum: ['Small', 'Medium', 'Large', 'Extra-Large']
    },
    price: {
        type: Number,
        required: true
    }
});

const pizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    toppings: [
        {
            type: String,
        }
    ],
    sizes: {
        type: [sizeSchema],
        required: true,
        validate: [val => val.length > 0, 'At least one size must be provided']
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Pizza = mongoose.model('Pizza', pizzaSchema);

module.exports = Pizza;

const Pizza = require('../models/pizza.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get all pizzas
// @route   GET /api/v1/pizzas
// @access  Public
const getAllPizzas = asyncHandler(async (req, res) => {
  const pizzas = await Pizza.find({});
  return res.status(200).json(new ApiResponse(200, pizzas, 'Pizzas retrieved successfully'));
});

// @desc    Get single pizza by ID
// @route   GET /api/v1/pizzas/:id
// @access  Public
const getPizzaById = asyncHandler(async (req, res) => {
  const pizza = await Pizza.findById(req.params.id);
  if (!pizza) {
    throw new ApiError(404, 'Pizza not found');
  }
  return res.status(200).json(new ApiResponse(200, pizza, 'Pizza retrieved successfully'));
});

// @desc    Create a new pizza
// @route   POST /api/v1/pizzas
// @access  Admin
const createPizza = asyncHandler(async (req, res) => {
  const { name, description, toppings, sizes, imageUrl } = req.body;
  const newPizza = await Pizza.create({ name, description, toppings, sizes, imageUrl });
  return res.status(201).json(new ApiResponse(201, newPizza, 'Pizza created successfully'));
});

// @desc    Update a pizza
// @route   PUT /api/v1/pizzas/:id
// @access  Admin
const updatePizza = asyncHandler(async (req, res) => {
  const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!pizza) {
    throw new ApiError(404, 'Pizza not found');
  }

  return res.status(200).json(new ApiResponse(200, pizza, 'Pizza updated successfully'));
});

// @desc    Delete a pizza
// @route   DELETE /api/v1/pizzas/:id
// @access  Admin
const deletePizza = asyncHandler(async (req, res) => {
  const pizza = await Pizza.findByIdAndDelete(req.params.id);

  if (!pizza) {
    throw new ApiError(404, 'Pizza not found');
  }

  return res.status(200).json(new ApiResponse(200, {}, 'Pizza deleted successfully'));
});

module.exports = {
  getAllPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
};

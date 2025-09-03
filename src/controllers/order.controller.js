const Order = require('../models/order.model');
const Pizza = require('../models/pizza.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Place a new order
// @route   POST /api/v1/orders
// @access  Private
const placeOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    throw new ApiError(400, 'No order items');
  }

  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const pizzaDoc = await Pizza.findById(item.pizza);
    if (!pizzaDoc) {
        throw new ApiError(404, `Pizza with ID ${item.pizza} not found`);
    }
    const sizeInfo = pizzaDoc.sizes.find(s => s.name === item.size);
    if (!sizeInfo) {
        throw new ApiError(400, `Size '${item.size}' not available for pizza '${pizzaDoc.name}'`);
    }
    totalAmount += sizeInfo.price * item.quantity;
    orderItems.push({ ...item, price: sizeInfo.price });
  }

  const order = new Order({
    user: req.user._id,
    items: orderItems,
    totalAmount,
    shippingAddress,
  });

  const createdOrder = await order.save();
  return res.status(201).json(new ApiResponse(201, createdOrder, 'Order placed successfully'));
});

// @desc    Get logged in user's orders
// @route   GET /api/v1/orders
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.pizza', 'name imageUrl');
  return res.status(200).json(new ApiResponse(200, orders, 'Orders fetched successfully'));
});

// @desc    Get all orders
// @route   GET /api/v1/orders/all
// @access  Admin
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'name email').populate('items.pizza', 'name');
    return res.status(200).json(new ApiResponse(200, orders, 'All orders fetched successfully'));
});

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.pizza', 'name imageUrl');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Check if user is admin or the owner of the order
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to view this order');
  }

  return res.status(200).json(new ApiResponse(200, order, 'Order details fetched'));
});

// @desc    Update order status
// @route   PATCH /api/v1/orders/:id/status
// @access  Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    order.status = status;
    await order.save();

    return res.status(200).json(new ApiResponse(200, order, 'Order status updated'));
});

module.exports = {
  placeOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
};

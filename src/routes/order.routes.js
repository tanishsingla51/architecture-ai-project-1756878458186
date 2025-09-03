const express = require('express');
const {
  placeOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/order.controller');
const verifyJWT = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

const router = express.Router();

// All routes below are protected
router.use(verifyJWT);

router.post('/', placeOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);

// Admin-only routes
router.get('/all', isAdmin, getAllOrders);
router.patch('/:id/status', isAdmin, updateOrderStatus);

module.exports = router;

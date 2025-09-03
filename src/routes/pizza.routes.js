const express = require('express');
const {
  createPizza,
  getAllPizzas,
  getPizzaById,
  updatePizza,
  deletePizza,
} = require('../controllers/pizza.controller');
const verifyJWT = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

const router = express.Router();

// Public routes
router.get('/', getAllPizzas);
router.get('/:id', getPizzaById);

// Admin-only routes
router.post('/', verifyJWT, isAdmin, createPizza);
router.put('/:id', verifyJWT, isAdmin, updatePizza);
router.delete('/:id', verifyJWT, isAdmin, deletePizza);

module.exports = router;

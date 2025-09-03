const express = require('express');
const authRouter = require('./auth.routes');
const pizzaRouter = require('./pizza.routes');
const orderRouter = require('./order.routes');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/pizzas', pizzaRouter);
router.use('/orders', orderRouter);

module.exports = router;

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/orderController');


router.post('/', authMiddleware, createOrder);

router.get('/', authMiddleware, getOrders);

router.get('/:id', authMiddleware, getOrderById);

router.put('/:id', authMiddleware, updateOrderStatus);

router.patch('/:id/cancel', authMiddleware, cancelOrder);


module.exports = router;
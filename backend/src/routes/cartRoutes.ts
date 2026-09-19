import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart
} from '../controllers/cartController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getCart);

router.route('/items')
  .post(protect, addToCart);

router.route('/items/:id')
  .delete(protect, removeFromCart);

export default router;

import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prismaClient';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: { product: true }
          }
        }
      });
    }

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { productId, quantity } = req.body;

    let cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    // Check if item exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity }
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } }
    });

    res.json({ success: true, data: updatedCart });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:id
// @access  Private
export const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const cartItemId = req.params.id as string;

    // Verify ownership indirectly by checking if the cartItem belongs to user's cart
    const cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, cartId: cart.id }
    });

    if (!cartItem) {
      res.status(404);
      throw new Error('Item not in cart');
    }

    await prisma.cartItem.delete({ where: { id: cartItemId } });

    res.json({ success: true, message: 'Item removed' });
  } catch (error) {
    next(error);
  }
};

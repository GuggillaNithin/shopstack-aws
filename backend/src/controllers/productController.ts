import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prismaClient';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.product.findMany();
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id as string },
    });

    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by Slug
// @route   GET /api/products/slug/:slug
// @access  Public
export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug as string },
    });

    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin (Mocked for now)
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, description, price, imageUrl, stock, category } = req.body;

    const product = await prisma.product.create({
      data: { name, slug, description, price, imageUrl, stock, category },
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin (Mocked for now)
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productExists = await prisma.product.findUnique({ where: { id: req.params.id as string } });

    if (!productExists) {
      res.status(404);
      throw new Error('Product not found');
    }

    const product = await prisma.product.update({
      where: { id: req.params.id as string },
      data: req.body,
    });

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin (Mocked for now)
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productExists = await prisma.product.findUnique({ where: { id: req.params.id as string } });

    if (!productExists) {
      res.status(404);
      throw new Error('Product not found');
    }

    await prisma.product.delete({ where: { id: req.params.id as string } });

    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

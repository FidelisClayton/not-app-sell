import { Errors } from "@/lib/error";
import { CreateProductServerSchema } from "@/models/product-model";
import { UserDocument } from "@/models/user-model";
import { ProductRepository } from "@/repositories/product-repository";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const handleGetAll = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: UserDocument,
) => {
  const { appId } = req.query;

  if (typeof appId !== "string") {
    return res.status(400).json(Errors.BAD_REQUEST);
  }

  try {
    const products = await ProductRepository.getAll(user.id, appId);
    return res.status(200).json(products);
  } catch (e) {
    console.error(e);
    return res.status(500).json(Errors.UNEXPECTED_ERROR);
  }
};

const handleGetById = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: UserDocument,
) => {
  const { productId } = req.query;

  if (typeof productId !== "string") {
    return res.status(400).json(Errors.BAD_REQUEST);
  }

  try {
    const product = await ProductRepository.getById(productId);

    if (!product) {
      return res.status(404).json(Errors.RESOURCE_NOT_FOUND);
    }

    if (String(product.createdBy) !== user._id.toString()) {
      return res.status(403).json(Errors.FORBIDDEN);
    }

    return res.status(200).json(product);
  } catch (e) {
    console.error(e);
    return res.status(500).json(Errors.UNEXPECTED_ERROR);
  }
};

const handlePost = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: UserDocument,
) => {
  try {
    const parsedData = CreateProductServerSchema.parse({
      ...req.body,
      createdBy: user.id,
    });

    const newProduct = await ProductRepository.create(parsedData);

    return res.status(201).json(newProduct);
  } catch (e) {
    console.error(e);

    if (e instanceof z.ZodError) {
      return res.status(400).json({ ...Errors.BAD_REQUEST, message: e.errors });
    }

    return res.status(500).json(Errors.UNEXPECTED_ERROR);
  }
};

const handlePut = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: UserDocument,
) => {
  const { productId } = req.query;

  if (typeof productId !== "string") {
    return res.status(400).json(Errors.BAD_REQUEST);
  }

  try {
    const parsedData = CreateProductServerSchema.parse({
      ...req.body,
      createdBy: user.id,
    });

    const product = await ProductRepository.getById(productId);

    if (!product) {
      return res.status(404).json(Errors.RESOURCE_NOT_FOUND);
    }

    if (String(product.createdBy) !== user._id.toString()) {
      return res.status(403).json(Errors.FORBIDDEN);
    }

    const updatedProduct = await ProductRepository.updateById(
      productId,
      parsedData,
    );
    return res.status(200).json(updatedProduct);
  } catch (e) {
    console.error(e);
    return res.status(500).json(Errors.UNEXPECTED_ERROR);
  }
};

const handleDelete = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: UserDocument,
) => {
  const { productId } = req.query;

  if (typeof productId !== "string") {
    return res.status(400).json(Errors.BAD_REQUEST);
  }

  try {
    const product = await ProductRepository.getById(productId);
    // TODO: delete child content

    if (!product) {
      return res.status(404).json(Errors.RESOURCE_NOT_FOUND);
    }

    if (String(product.createdBy) !== user._id.toString()) {
      return res.status(403).json(Errors.FORBIDDEN);
    }

    await ProductRepository.deleteById(productId);
    return res.status(204).end();
  } catch (e) {
    return res.status(500).json(Errors.UNEXPECTED_ERROR);
  }
};

export const ProductController = {
  handleGetAll,
  handleGetById,
  handlePost,
  handlePut,
  handleDelete,
};

import { Errors } from "@shared/lib/error";
import { UserDocument } from "@shared/models/user-model";
import { PageRepository } from "@shared/repositories/page-repository";
import {
  CreatePageServerSchema,
  UpdatePageServerSchema,
} from "@shared/validation/page-validation";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const handleGetAll = async (req: NextApiRequest, res: NextApiResponse) => {
  const { productId } = req.query;

  if (typeof productId !== "string") {
    return res.status(400).json(Errors.BAD_REQUEST);
  }

  try {
    const pages = await PageRepository.getAll(productId);
    return res.status(200).json(pages);
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
  const { pageId } = req.query;

  if (typeof pageId !== "string") {
    return res.status(400).json(Errors.BAD_REQUEST);
  }

  try {
    const page = await PageRepository.getById(pageId);

    if (!page) {
      return res.status(404).json(Errors.RESOURCE_NOT_FOUND);
    }

    if (String(page.createdBy) !== user._id.toString()) {
      return res.status(403).json(Errors.FORBIDDEN);
    }

    return res.status(200).json(page);
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
    console.log(req.body);
    const parsedData = CreatePageServerSchema.parse({
      ...req.body,
      content: "<p></p>",
      createdBy: user._id.toString(),
    });

    const newPage = await PageRepository.create(parsedData);
    return res.status(201).json(newPage);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors });
    }
    console.error(e);
    return res.status(500).json(Errors.UNEXPECTED_ERROR);
  }
};

const handlePut = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: UserDocument,
) => {
  const { pageId } = req.query;

  if (typeof pageId !== "string") {
    return res.status(400).json(Errors.BAD_REQUEST);
  }

  try {
    const parsedData = UpdatePageServerSchema.parse(req.body);

    const page = await PageRepository.getById(pageId);

    if (!page) {
      return res.status(404).json(Errors.RESOURCE_NOT_FOUND);
    }

    if (String(page.createdBy) !== user._id.toString()) {
      return res.status(403).json(Errors.FORBIDDEN);
    }

    const updatedPage = await PageRepository.updateById(pageId, parsedData);
    return res.status(200).json(updatedPage);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors });
    }
    console.error(e);
    return res.status(500).json(Errors.UNEXPECTED_ERROR);
  }
};

const handleDelete = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: UserDocument,
) => {
  const { pageId } = req.query;

  if (typeof pageId !== "string") {
    return res.status(400).json(Errors.BAD_REQUEST);
  }

  try {
    const page = await PageRepository.getById(pageId);

    if (!page) {
      return res.status(404).json(Errors.RESOURCE_NOT_FOUND);
    }

    if (String(page.createdBy) !== user._id.toString()) {
      return res.status(403).json(Errors.FORBIDDEN);
    }

    await PageRepository.deleteById(pageId);
    return res.status(204).end();
  } catch (e) {
    console.error(e);
    return res.status(500).json(Errors.UNEXPECTED_ERROR);
  }
};

export const PageController = {
  handleGetAll,
  handleGetById,
  handlePost,
  handlePut,
  handleDelete,
};

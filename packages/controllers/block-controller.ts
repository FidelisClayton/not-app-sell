import { BlockRepository } from "@shared/repositories/block-repository";
import {
  CreateBlockSchema,
  UpdateBlockSchema,
} from "@shared/validation/block-validation";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const handleGetAllByPage = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const { pageId } = req.query;

  if (typeof pageId !== "string") {
    return res
      .status(400)
      .json({ error: "`pageId` is required and must be a string" });
  }

  try {
    const blocks = await BlockRepository.getAllByPage(pageId);
    return res.status(200).json(blocks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch blocks" });
  }
};

const handleGetById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { blockId } = req.query;

  if (typeof blockId !== "string") {
    return res
      .status(400)
      .json({ error: "`blockId` is required and must be a string" });
  }

  try {
    const block = await BlockRepository.getById(blockId);

    if (!block) {
      return res.status(404).json({ error: "Block not found" });
    }

    return res.status(200).json(block);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch block" });
  }
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const parsedData = CreateBlockSchema.parse(req.body);

    const newBlock = await BlockRepository.create(parsedData);
    return res.status(201).json(newBlock);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    return res.status(500).json({ error: "Failed to create block" });
  }
};

const handlePut = async (req: NextApiRequest, res: NextApiResponse) => {
  const { blockId } = req.query;

  if (typeof blockId !== "string") {
    return res
      .status(400)
      .json({ error: "`blockId` is required and must be a string" });
  }

  try {
    const parsedData = UpdateBlockSchema.parse(req.body);

    const updatedBlock = await BlockRepository.updateById(blockId, parsedData);
    return res.status(200).json(updatedBlock);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    return res.status(500).json({ error: "Failed to update block" });
  }
};

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const { blockId } = req.query;

  if (typeof blockId !== "string") {
    return res
      .status(400)
      .json({ error: "`blockId` is required and must be a string" });
  }

  try {
    await BlockRepository.deleteById(blockId);
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete block" });
  }
};

const handleReorder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { blockId } = req.body;

  if (typeof blockId !== "string") {
    return res
      .status(400)
      .json({ error: "`blockId` is required and must be a string" });
  }

  if (typeof req.body.index !== "number") {
    return res.status(400).json({ error: "`index` is invalid" });
  }

  try {
    await BlockRepository.reorderById(blockId, req.body);
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to reorder block" });
  }
};

export const BlockController = {
  handleGetAllByPage,
  handleGetById,
  handlePost,
  handlePut,
  handleDelete,
  handleReorder,
};

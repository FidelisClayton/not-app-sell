import { z } from "zod";
import { BlockModel } from "@/models/block-model";
import {
  CreateBlockSchema,
  UpdateBlockSchema,
} from "@/validation/block-validation";

const getAllByPage = async (pageId: string) => {
  return BlockModel.find({ page: pageId })
    .select("-__v")
    .sort({ index: 1 }) // Ensure blocks are sorted by index
    .lean();
};

const getById = async (id: string) => {
  const block = await BlockModel.findById(id).select("-__v").lean();

  return block;
};

const create = async (data: z.infer<typeof CreateBlockSchema>) => {
  const newBlock = await BlockModel.create(data);
  return newBlock;
};

const updateById = async (
  id: string,
  data: z.infer<typeof UpdateBlockSchema>,
) => {
  const block = await BlockModel.findById(id);
  const updatedBlock = await block?.updateOne(data, { new: true });

  if (!updatedBlock) {
    throw new Error(`Block with ID ${id} not found`);
  }

  return updatedBlock;
};

const deleteById = async (id: string) => {
  return BlockModel.findByIdAndDelete(id);
};

export const BlockRepository = {
  getAllByPage,
  getById,
  create,
  updateById,
  deleteById,
};

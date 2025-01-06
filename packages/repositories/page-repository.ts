import { PageModel } from "@shared/models";
import {
  CreatePageServerSchema,
  UpdatePageServerSchema,
} from "@shared/validation";
import { z } from "zod";

const getAll = async (productId: string) => {
  return PageModel.find({ product: productId }).select("-__v").lean();
};

const getById = async (id: string) => {
  const page = await PageModel.findById(id).select("-__v").lean();

  return page;
};

const create = async (data: z.infer<typeof CreatePageServerSchema>) => {
  const newPage = await PageModel.create(data);
  return newPage;
};

const updateById = async (
  id: string,
  data: z.infer<typeof UpdatePageServerSchema>,
) => {
  await PageModel.findOneAndUpdate({ _id: id }, data, { new: true });
  const updatedPage = await PageModel.findById(id).lean();
  return updatedPage;
};

const deleteById = async (id: string) => {
  return PageModel.findByIdAndDelete(id);
};

export const PageRepository = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};

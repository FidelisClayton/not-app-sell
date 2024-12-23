import { PageModel } from "@/models";
import {
  CreatePageSchema,
  UpdatePageSchema,
} from "@/validation/page-validation";
import { z } from "zod";

const getAll = async (productId: string) => {
  return PageModel.find({ product: productId })
    .select("-__v")
    .populate({ path: "product", select: "_id name" })
    .lean();
};

const getById = async (id: string) => {
  const page = await PageModel.findById(id)
    .select("-__v")
    .populate({ path: "product", select: "_id name" })
    .lean();

  return page;
};

const create = async (data: z.infer<typeof CreatePageSchema>) => {
  const newPage = await PageModel.create(data);
  return newPage;
};

const updateById = async (
  id: string,
  data: z.infer<typeof UpdatePageSchema>,
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

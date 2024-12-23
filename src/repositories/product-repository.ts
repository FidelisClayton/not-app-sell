import {
  ProductModel,
  CreateProductServerSchema,
  UpdateProductServerSchema,
} from "@/models";
import { z } from "zod";

const getAll = async (userId: string, appId: string) => {
  return ProductModel.find({ createdBy: userId, app: appId })
    .select("-__v")
    .lean();
};

const getById = async (id: string) => {
  return ProductModel.findById(id).select("-__v").lean();
};

const create = async (data: z.infer<typeof CreateProductServerSchema>) => {
  return ProductModel.create(data);
};

const updateById = async (
  id: string,
  data: z.infer<typeof UpdateProductServerSchema>,
) => {
  return ProductModel.findOneAndUpdate({ _id: id }, data, { new: true });
};

const deleteById = async (id: string) => {
  return ProductModel.findByIdAndDelete(id);
};

export const ProductRepository = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};

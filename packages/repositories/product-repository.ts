import {
  ProductModel,
  CreateProductServerSchema,
  UpdateProductServerSchema,
  Product,
  CustomerProductModel,
} from "@shared/models";
import { z } from "zod";
import { CustomerProductRepository } from "./customer-product-repository";

const getAll = async (userId: string, appId: string) => {
  return ProductModel.find({ createdBy: userId, app: appId })
    .select("-__v")
    .lean<Product>();
};

const getAllByApp = async (appId: string) => {
  return ProductModel.find({ app: appId }).select("-__v").lean<Product>();
};

const getOwned = async (customerId: string) => {
  const ownedProducts =
    await CustomerProductRepository.findActiveByCustomer(customerId);

  return ownedProducts.map((customerProduct) => customerProduct.product);
};

const getUnowned = async (customerId: string, appId: string) => {
  const customerProducts =
    await CustomerProductRepository.findActiveByCustomer(customerId);

  const customerProductsForApp = customerProducts;
  const productIdsToExclude = customerProductsForApp.map((cp) =>
    cp.product._id.toString(),
  );

  const products = await ProductModel.find({
    _id: { $nin: productIdsToExclude },
    app: appId,
  });
  return products;
};

const getById = async (id: string) => {
  return ProductModel.findById(id).select("-__v").lean<Product>();
};

const getByExternalProductId = async (id: string) => {
  return ProductModel.findOne({ externalProductId: id })
    .select("-__v")
    .lean<Product>();
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
  getAllByApp,
  getOwned,
  getUnowned,
  getById,
  create,
  updateById,
  deleteById,
  getByExternalProductId,
};

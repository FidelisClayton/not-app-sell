import {
  ProductModel,
  CreateProductServerSchema,
  UpdateProductServerSchema,
  Product,
  CustomerProductModel,
  BlockModel,
  PageModel,
} from "@shared/models";
import { z } from "zod";
import { CustomerProductRepository } from "./customer-product-repository";
import { PageRepository } from "./page-repository";
import { BlockRepository } from "./block-repository";

const getAll = async (userId: string, appId: string) => {
  return ProductModel.find({ createdBy: userId, app: appId })
    .select("-__v")
    .lean<Product>();
};

const getAllByApp = async (appId: string) => {
  return ProductModel.find({ app: appId }).select("-__v").lean<Product>();
};

const getOwned = async (customerId: string, appId: string) => {
  const ownedProducts =
    await CustomerProductRepository.findActiveByCustomer(customerId);

  return ownedProducts
    .map((customerProduct) => customerProduct.product)
    .filter((product) => product.app.toString() === appId);
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
  await ProductModel.findByIdAndDelete(id);
  const pages = await PageModel.find({ product: id });
  await BlockModel.deleteMany({
    page: { $in: pages.map((page) => page._id.toString()) },
  });
  await PageModel.deleteMany({ product: id });

  return;
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

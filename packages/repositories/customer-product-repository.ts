import { CustomerProductModel, Product } from "@shared/models";

export const CustomerProductRepository = {
  async findById(id: string) {
    return CustomerProductModel.findById(id).lean();
  },

  async findByCustomer(customerId: string) {
    return CustomerProductModel.find({ customer: customerId }).lean();
  },

  async findActiveByCustomer(customerId: string) {
    return CustomerProductModel.find({
      customer: customerId,
      isActive: true,
    })
      .populate<{ product: Product }>("product")
      .lean();
  },

  async findByProduct(productId: string) {
    return CustomerProductModel.find({ product: productId }).lean();
  },

  async create(customerId: string, productId: string) {
    return CustomerProductModel.create({
      customer: customerId,
      product: productId,
    });
  },

  async activate(customerId: string, productId: string) {
    return CustomerProductModel.findOneAndUpdate(
      { customer: customerId, product: productId },
      { isActive: true },
      { new: true },
    ).lean();
  },

  async deactivate(customerId: string, productId: string) {
    return CustomerProductModel.findOneAndUpdate(
      { customer: customerId, product: productId },
      { isActive: false },
      { new: true },
    )
      .lean()
      .exec();
  },

  async delete(customerId: string, productId: string) {
    return CustomerProductModel.deleteOne({
      customer: customerId,
      product: productId,
    });
  },

  async upsert(
    customerId: string,
    productId: string,
    update: { isActive: boolean },
  ) {
    console.log("upserting", customerId, productId);
    return CustomerProductModel.updateOne(
      { customer: customerId, product: productId }, // Match criteria
      { $set: update }, // Update or set new values
      { upsert: true }, // Create if it doesn't exist
    );
  },
};

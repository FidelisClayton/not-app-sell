import { CustomerAppModel } from "@shared/models";

export const CustomerAppRepository = {
  async findById(id: string) {
    return CustomerAppModel.findById(id).lean();
  },

  async findByCustomerAndApp(customerId: string, appId: string) {
    return CustomerAppModel.findOne({ app: appId, customer: customerId })
      .lean()
      .exec();
  },

  async findByCustomer(customerId: string) {
    return CustomerAppModel.find({ customer: customerId }).lean();
  },

  async findActiveByCustomer(customerId: string) {
    return CustomerAppModel.find({
      customer: customerId,
      isActive: true,
    }).lean();
  },

  async findByApp(appId: string) {
    return CustomerAppModel.find({ app: appId }).lean();
  },

  async create(customerId: string, appId: string) {
    return CustomerAppModel.create({ customer: customerId, app: appId });
  },

  async activate(customerId: string, appId: string) {
    return CustomerAppModel.findOneAndUpdate(
      { customer: customerId, app: appId },
      { isActive: true },
      { new: true },
    ).lean();
  },

  async deactivate(customerId: string, appId: string) {
    return CustomerAppModel.findOneAndUpdate(
      { customer: customerId, app: appId },
      { isActive: false },
      { new: true },
    ).lean();
  },

  async delete(customerId: string, appId: string) {
    return CustomerAppModel.deleteOne({ customer: customerId, app: appId });
  },

  async upsert(
    customerId: string,
    appId: string,
    update: { isActive: boolean },
  ) {
    return CustomerAppModel.updateOne(
      { customer: customerId, app: appId }, // Match criteria
      { $set: update }, // Update or set new values
      { upsert: true }, // Create if it doesn't exist
    );
  },
};

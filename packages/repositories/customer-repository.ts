import { CustomerDocument, CustomerModel } from "@shared/models";

export const CustomerRepository = {
  async findById(id: string) {
    return CustomerModel.findById(id).lean().exec();
  },

  async findByEmail(email: string) {
    return CustomerModel.findOne({ email }).lean().exec();
  },

  async create(
    data: Omit<CustomerDocument, "_id" | "createdAt" | "updatedAt">,
  ) {
    return CustomerModel.create(data);
  },

  async updateById(
    id: string,
    data: Partial<Omit<CustomerDocument, "_id" | "createdAt" | "updatedAt">>,
  ) {
    return CustomerModel.findByIdAndUpdate(id, data, {
      new: true,
      lean: true,
    }).exec();
  },

  async deleteById(id: string): Promise<boolean> {
    const result = await CustomerModel.findByIdAndDelete(id).exec();
    return result !== null;
  },

  async findAll() {
    return CustomerModel.find().lean().exec();
  },
};

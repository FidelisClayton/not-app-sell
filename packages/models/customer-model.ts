import mongoose, { Model, model, Schema } from "mongoose";

export type Customer = {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomerDocument = Customer;

const CustomerSchema = new Schema<CustomerDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  },
);

export const CustomerModel: Model<CustomerDocument> =
  mongoose.models?.Customer ||
  model<CustomerDocument>("Customer", CustomerSchema);

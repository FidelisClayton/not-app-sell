import mongoose, { model, Model, Schema } from "mongoose";

export type CustomerProgress = {
  _id: string;
  customer: Schema.Types.ObjectId; // Reference to Customer
  product: Schema.Types.ObjectId; // Reference to Product
  page: Schema.Types.ObjectId; // Reference to Page
  isCompleted: boolean; // Whether the page is completed
  completedAt?: Date; // Timestamp for when it was completed
  createdAt: Date;
  updatedAt: Date;
};

export type CustomerProgressDocument = CustomerProgress;

const CustomerProgressSchema = new Schema<CustomerProgressDocument>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "`customer` is required"],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "`product` is required"],
    },
    page: {
      type: Schema.Types.ObjectId,
      ref: "Page",
      required: [true, "`page` is required"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const CustomerProgressModel: Model<CustomerProgressDocument> =
  mongoose.models?.CustomerProgress ||
  model<CustomerProgressDocument>("CustomerProgress", CustomerProgressSchema);

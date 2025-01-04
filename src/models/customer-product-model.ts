import mongoose, { Model, Schema, model } from "mongoose";

export type CustomerProduct = {
  _id: string;
  customer: string;
  product: string;
  grantedAt: Date; // Metadata: when the relationship was created
  isActive: boolean;
};

export type CustomerProductDocument = Omit<
  CustomerProduct,
  "customer" | "product"
> & {
  customer: mongoose.Types.ObjectId; // Reference to Customer
  product: mongoose.Types.ObjectId; // Reference to Product
};

const CustomerProductSchema = new Schema<CustomerProductDocument>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    grantedAt: { type: Date, default: Date.now }, // Metadata
    isActive: { type: Schema.Types.Boolean, default: false, required: true },
  },
  { timestamps: true },
);

export const CustomerProductModel: Model<CustomerProductDocument> =
  mongoose.models.CustomerProduct ||
  model<CustomerProductDocument>("CustomerProduct", CustomerProductSchema);

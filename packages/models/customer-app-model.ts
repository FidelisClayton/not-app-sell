import mongoose, { Schema, model, Model } from "mongoose";

export type CustomerApp = {
  _id: string;
  customer: string;
  password: string;
  app: string;
  grantedAt: Date; // Metadata: when the relationship was created
  isActive: boolean;
};

export type CustomerAppDocument = Omit<CustomerApp, "customer" | "app"> & {
  customer: mongoose.Types.ObjectId; // Reference to Customer
  app: mongoose.Types.ObjectId; // Reference to App
};

const CustomerAppSchema = new Schema<CustomerAppDocument>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    password: { type: String, required: false },
    app: { type: Schema.Types.ObjectId, ref: "App", required: true },
    grantedAt: { type: Date, default: Date.now }, // Metadata
    isActive: { type: Schema.Types.Boolean, default: false, required: true },
  },
  { timestamps: true },
);

export const CustomerAppModel: Model<CustomerAppDocument> =
  mongoose.models.CustomerApp ||
  model<CustomerAppDocument>("CustomerApp", CustomerAppSchema);

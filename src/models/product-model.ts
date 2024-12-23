import mongoose, { model, Model, Schema } from "mongoose";
import { z } from "zod";

export type ProductDocument = {
  _id: string;
  name: string;
  coverUrl?: string;
  description?: string;
  app: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  createdBy: Schema.Types.ObjectId;
};

const schema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: [true, "`name` is required"],
    },
    coverUrl: { type: String, required: false },
    description: { type: String, required: false },
    app: {
      type: Schema.Types.ObjectId,
      ref: "App",
      required: [true, "`app` is required"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "`createdBy` is required"],
    },
  },
  {
    timestamps: true,
  },
);

export const ProductModel: Model<ProductDocument> =
  mongoose.models?.Product || model<ProductDocument>("Product", schema);

export const ProductSchema = z.object({
  name: z.string().min(1, "`name` is required"),
  coverUrl: z.string().url().optional(),
  description: z.string().optional(),
  app: z.string().regex(/^[0-9a-fA-F]{24}$/, "`app` must be a valid ObjectId"),
  createdBy: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "`createdBy` must be a valid ObjectId"),
});

// Validation schema for creating a new Product
export const CreateProductServerSchema = ProductSchema.omit({
  createdBy: true,
}).extend({
  createdBy: z.string().regex(/^[0-9a-fA-F]{24}$/, "`createdBy` is required"),
});

export const CreateProductClientSchema = CreateProductServerSchema.omit({
  createdBy: true,
  app: true,
}).extend({
  app: z.string().regex(/^[0-9a-fA-F]{24}$/, "`createdBy` is required"),
});

// Validation schema for updating a Product
export const UpdateProductServerSchema = ProductSchema.partial(); // All fields are optional for updates

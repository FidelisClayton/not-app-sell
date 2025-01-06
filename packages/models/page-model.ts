import mongoose, { model, Model, Schema } from "mongoose";

export type Page = {
  _id: string;
  product: string;
  createdBy: string;
  name: string;
  content: string;
  coverUrl?: string;
  index: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PageDocument = Omit<Page, "product" | "createdBy"> & {
  product: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
};

const PageSchema = new Schema<PageDocument>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "`product` is required"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "`createdBy` is required"],
    },
    name: {
      type: String,
      required: [true, "`name` is required"],
    },
    content: {
      type: String,
      required: [true, "`content` is required"],
    },
    coverUrl: {
      type: String,
      required: false,
    },
    index: {
      type: Number,
      required: [true, "`index` is required"],
      min: [0, "`index` must be greater than or equal to 0"],
    },
  },
  {
    timestamps: true,
  },
);

export const PageModel: Model<PageDocument> =
  mongoose.models?.Page || model<PageDocument>("Page", PageSchema);

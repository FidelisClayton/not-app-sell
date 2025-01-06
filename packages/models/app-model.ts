import mongoose, { model, Model, Schema } from "mongoose";

export type AppDocument = {
  _id: string;
  name: string;
  colorScheme: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  description: string | null;
  language: string | null;
  supportEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: Schema.Types.ObjectId;
};

const AppSchema = new Schema<AppDocument>(
  {
    name: {
      type: String,
      required: [true, "`name` is required"],
    },
    colorScheme: {
      type: String,
      required: [true, "`colorScheme` is required"],
    },
    logoUrl: {
      type: String,
      required: false,
    },
    bannerUrl: {
      type: String,
      required: false,
    },
    description: {
      type: String,
    },
    language: {
      type: String,
    },
    supportEmail: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
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

export const AppModel: Model<AppDocument> =
  mongoose.models?.App || model<AppDocument>("App", AppSchema);

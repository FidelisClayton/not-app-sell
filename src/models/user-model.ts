import mongoose, { Model, model, Schema } from "mongoose";

export type UserDocument = {
  id: string;
  _id: Schema.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel: Model<UserDocument> =
  mongoose.models?.User || model<UserDocument>("User", UserSchema);

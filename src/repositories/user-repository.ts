import { UserModel } from "@/models";

const getById = async (userId: string) => {
  const user = await UserModel.findById(userId, { password: 0 }).exec();

  return user;
};

const getByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email }, { password: 0 }).exec();

  return user;
};

export const UserRepository = {
  getById,
  getByEmail,
};

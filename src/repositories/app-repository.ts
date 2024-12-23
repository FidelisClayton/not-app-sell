import { AppDocument, AppModel } from "@/models";

const getAll = async (userId: string, page = 1, limit = 10) => {
  return AppModel.find({ createdBy: userId })
    .select("-__v")
    .populate({ path: "createdBy", select: "__id name" })
    .skip(page)
    .limit(limit)
    .lean();
};

const getById = async (id: string) => {
  const app = await AppModel.findById(id).select("-__v").lean();

  return app;
};

const create = async (
  data: Omit<AppDocument, "_id" | "id" | "createdAt" | "updatedAt">,
) => {
  const newApp = await AppModel.create(data);

  return newApp;
};

const updateById = async (id: string, data: AppDocument) => {
  await AppModel.findOneAndUpdate({ _id: id }, data);
  const updatedApp = await AppModel.findById(id).lean();

  return updatedApp;
};

const deleteById = async (id: string) => {
  return AppModel.findByIdAndDelete(id);
};

export const AppRepository = {
  create,
  deleteById,
  getAll,
  getById,
  updateById,
};

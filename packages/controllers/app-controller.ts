import { Errors } from "@shared/lib/error";
import { UserDocument } from "@shared/models/user-model";
import { AppRepository } from "@shared/repositories/app-repository";
import { NextApiRequest, NextApiResponse } from "next";

const handleGetById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { appId } = req.query;

  if (typeof appId !== "string") {
    console.error("`appId` is missing");
    return res.status(400).json(Errors.BAD_REQUEST);
  }

  try {
    // TODO: return only created by use
    const app = await AppRepository.getById(appId);

    if (!app) {
      return res.status(404).json(Errors.RESOURCE_NOT_FOUND);
    }

    return res.status(200).json(app);
  } catch (e) {
    console.error(e);
    return res.status(400).json(Errors.UNEXPECTED_ERROR);
  }
};

const handlePut = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: UserDocument,
) => {
  const { appId } = req.query;

  if (typeof appId !== "string")
    return res.status(400).json(Errors.BAD_REQUEST);

  try {
    const app = await AppRepository.getById(appId);

    if (!app) return res.status(404).json(Errors.RESOURCE_NOT_FOUND);

    if (String(app.createdBy) !== user._id.toString())
      return res.status(403).json(Errors.FORBIDDEN);

    await AppRepository.updateById(appId, req.body);

    const updatedApp = await AppRepository.getById(appId);

    return res.status(200).json(updatedApp);
  } catch (e) {
    console.error(e);
    return res.status(400).json(Errors.UNEXPECTED_ERROR);
  }
};

const handleDelete = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: UserDocument,
) => {
  const { appId } = req.query;

  if (typeof appId !== "string")
    return res.status(400).json(Errors.BAD_REQUEST);

  try {
    const app = await AppRepository.getById(user.id);

    if (!app) return res.status(404).json(Errors.RESOURCE_NOT_FOUND);

    if (String(app.createdBy) !== user.id)
      return res.status(403).json(Errors.FORBIDDEN);

    await AppRepository.deleteById(app._id);

    return res.status(204).end();
  } catch (e) {
    console.error(e);
    return res.status(400).json(Errors.UNEXPECTED_ERROR);
  }
};

const handleGetAll = async (
  _: NextApiRequest,
  res: NextApiResponse,
  user: UserDocument,
) => {
  try {
    const apps = await AppRepository.getAll(user.id);

    return res.status(200).json(apps);
  } catch (e) {
    console.error(e);
    return res.status(400).json(Errors.UNEXPECTED_ERROR);
  }
};

const handlePost = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: UserDocument,
) => {
  try {
    const newApp = await AppRepository.create({
      ...req.body,
      createdBy: user.id,
    });

    return res.status(201).json(newApp);
  } catch (e) {
    console.error(e);
    return res.status(400).json(Errors.UNEXPECTED_ERROR);
  }
};

export const AppController = {
  handleGetById,
  handleGetAll,
  handlePut,
  handleDelete,
  handlePost,
};

import { z } from "zod";
import { Block, BlockModel } from "@shared/models/block-model";
import {
  CreateBlockSchema,
  UpdateBlockSchema,
} from "@shared/validation/block-validation";
import { match } from "ts-pattern";
import { ObjectId } from "bson";

const getAllByPage = async (pageId: string) => {
  return BlockModel.find({ page: pageId })
    .select("-__v")
    .sort({ index: 1 }) // Ensure blocks are sorted by index
    .lean();
};

const getById = async (id: string) => {
  const block = await BlockModel.findById(id).select("-__v").lean();

  return block;
};

const create = async (data: z.infer<typeof CreateBlockSchema>) => {
  const allItems = await getAllByPage(data.page);
  const targetArrayIndex = match(
    allItems.findIndex((item) => item.index === data.index),
  )
    .with(-1, () => allItems.length)
    .otherwise((index) => index);

  const itemsWithNewItem: Array<Block | z.infer<typeof CreateBlockSchema>> =
    match(allItems)
      .when(
        (items) => items.length === 0,
        () => [data],
      )
      .when(
        (items) => data.index >= items.length,
        () => [...allItems, data],
      )
      .otherwise(() =>
        allItems.flatMap((item, index) => {
          if (index === targetArrayIndex) return [data, item];
          return item;
        }),
      );

  let indexOfNewlyCreatedIndex = -1;
  const promises = itemsWithNewItem.map((item, index) => {
    if ("_id" in item) {
      indexOfNewlyCreatedIndex = index;
      return BlockModel.findOneAndUpdate({ _id: item._id }, { index }).exec();
    }

    return BlockModel.create({
      ...data,
      index,
    });
  });

  const result = await Promise.all(promises);

  return result[indexOfNewlyCreatedIndex];
};

const updateById = async (
  id: string,
  data: z.infer<typeof UpdateBlockSchema>,
) => {
  const block = await BlockModel.findById(id);

  if (!block) {
    throw new Error(`Block with ID ${id} not found`);
  }

  const updatedBlock = await block.updateOne(data, { new: true });
  return updatedBlock;
};

const reorderById = async (id: string, data: { index: number }) => {
  const block = await BlockModel.findById(id);

  if (!block) {
    throw new Error(`Block with ID ${id} not found`);
  }

  const allItems = await getAllByPage(block.page);
  const targetArrayIndex = allItems.findIndex(
    (item) => item.index === data.index,
  );

  const filteredItems = allItems.filter(
    (item) => (item._id as unknown as ObjectId).toString() !== id,
  );

  const itemsWithNewItem: Array<Block> = match(filteredItems)
    .when(
      (filteredItems) => filteredItems.length === targetArrayIndex,
      (filteredItems) => [...filteredItems, block],
    )
    .otherwise((filteredItems) =>
      filteredItems.flatMap((item, index) => {
        if (index === targetArrayIndex) {
          return [block, item];
        }
        return item;
      }),
    );

  const promises = itemsWithNewItem.map((item, index) =>
    BlockModel.updateOne({ _id: item._id }, { index }).exec(),
  );

  await Promise.all(promises);

  return block;
};

const deleteById = async (id: string) => {
  return BlockModel.findByIdAndDelete(id);
};

export const BlockRepository = {
  getAllByPage,
  getById,
  create,
  updateById,
  deleteById,
  reorderById,
};

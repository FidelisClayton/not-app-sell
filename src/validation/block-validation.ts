import { BlockType } from "@/models/block-model";
import { z } from "zod";

// Base Block Schema
const BlockBaseSchema = z.object({
  _id: z.string().regex(/^[0-9a-fA-F]{24}$/, "`_id` must be a valid ObjectId"),
  page: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "`page` must be a valid ObjectId"),
  index: z.number().min(0, "`index` must be greater than or equal to 0"),
});

// Text Block
const TextBlockSchema = BlockBaseSchema.extend({
  type: z.literal(BlockType.Text),
  content: z.string().nullable().or(z.literal("")),
});

// File Block
const FileBlockSchema = BlockBaseSchema.extend({
  type: z.literal(BlockType.File),
  url: z.string().nullable(),
  description: z.string().nullable(),
  fileName: z.string().nullable(),
  fileSize: z.number().nullable(),
});

// Image Block
const ImageBlockSchema = BlockBaseSchema.extend({
  type: z.literal(BlockType.Image),
  url: z.string().url("`url` must be a valid URL").nullable(),
  description: z.string().nullable(),
});

// Video Embed Block
const VideoEmbedBlockSchema = BlockBaseSchema.extend({
  type: z.literal(BlockType.VideoEmbed),
  url: z.string().url("`url` must be a valid URL").nullable(),
  provider: z.string().min(1, "`provider` is required"),
});

// Audio Block
const AudioBlockSchema = BlockBaseSchema.extend({
  type: z.literal(BlockType.Audio),
  url: z.string().url("`url` must be a valid URL").nullable(),
  description: z.string().nullable(),
});

export const BlockSchema = z.discriminatedUnion("type", [
  TextBlockSchema,
  FileBlockSchema,
  ImageBlockSchema,
  VideoEmbedBlockSchema,
  AudioBlockSchema,
]);

export const BlocksArraySchema = z.array(BlockSchema);

const BlockBaseCreateSchema = z.object({
  page: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "`page` must be a valid ObjectId"),
  index: z.number().min(0, "`index` must be greater than or equal to 0"),
});

// Define schemas for each block type without `_id` or timestamps
const TextBlockCreateSchema = BlockBaseCreateSchema.extend({
  type: z.literal(BlockType.Text),
  content: z.string().nullable().optional().or(z.literal("")),
});

const FileBlockCreateSchema = BlockBaseCreateSchema.extend({
  type: z.literal(BlockType.File),
  url: z.string().url("`url` must be a valid URL").nullable(),
  fileName: z.string().nullable(),
  fileSize: z.number().nullable(),
});

const ImageBlockCreateSchema = BlockBaseCreateSchema.extend({
  type: z.literal(BlockType.Image),
  url: z.string().url("`url` must be a valid URL").nullable(),
  description: z.string().optional(),
});

const VideoEmbedBlockCreateSchema = BlockBaseCreateSchema.extend({
  type: z.literal(BlockType.VideoEmbed),
  url: z.string().url("`url` must be a valid URL").nullable(),
  provider: z.string().min(1, "`provider` is required"),
});

const AudioBlockCreateSchema = BlockBaseCreateSchema.extend({
  type: z.literal(BlockType.Audio),
  url: z.string().url("`url` must be a valid URL").nullable(),
});

// Combine into a discriminated union
export const CreateBlockSchema = z.discriminatedUnion("type", [
  TextBlockCreateSchema,
  FileBlockCreateSchema,
  ImageBlockCreateSchema,
  VideoEmbedBlockCreateSchema,
  AudioBlockCreateSchema,
]);

const BlockBaseUpdateSchema = BlockBaseCreateSchema.partial();

const TextBlockUpdateSchema = BlockBaseUpdateSchema.extend({
  type: z.literal(BlockType.Text),
  content: z.string().optional(),
});

const FileBlockUpdateSchema = BlockBaseUpdateSchema.extend({
  type: z.literal(BlockType.File),
  url: z.string().url("`url` must be a valid URL").nullable().optional(),
  description: z.string().nullable().optional(),
  fileName: z.string().nullable(),
  fileSize: z.number().nullable(),
});

const ImageBlockUpdateSchema = BlockBaseUpdateSchema.extend({
  type: z.literal(BlockType.Image),
  url: z.string().url("`url` must be a valid URL").nullable().optional(),
  description: z.string().nullable().optional(),
});

const VideoEmbedBlockUpdateSchema = BlockBaseUpdateSchema.extend({
  type: z.literal(BlockType.VideoEmbed),
  url: z.string().url("`url` must be a valid URL").nullable().optional(),
  provider: z.string().nullable().optional(),
});

const AudioBlockUpdateSchema = BlockBaseUpdateSchema.extend({
  type: z.literal(BlockType.Audio),
  url: z.string().url("`url` must be a valid URL").nullable().optional(),
  description: z.string().nullable().optional(),
});

// Combine into a discriminated union
export const UpdateBlockSchema = z.discriminatedUnion("type", [
  TextBlockUpdateSchema,
  FileBlockUpdateSchema,
  ImageBlockUpdateSchema,
  VideoEmbedBlockUpdateSchema,
  AudioBlockUpdateSchema,
]);

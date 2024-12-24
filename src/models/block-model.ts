import mongoose, { Schema, model, Model } from "mongoose";

export enum BlockType {
  Text = "Text",
  File = "File",
  Image = "Image",
  VideoEmbed = "VideoEmbed",
  Audio = "Audio",
}

interface BlockLike {
  _id: string;
  index: number;
  page: string;
}

export interface TextBlock extends BlockLike {
  type: BlockType.Text;
  content: string;
}

export interface FileBlock extends BlockLike {
  type: BlockType.File;
  url: string | null;
  fileName: string | null;
  fileSize: number | null;
}

export interface ImageBlock extends BlockLike {
  type: BlockType.Image;
  url: string | null;
  description?: string;
}

export interface VideoEmbedBlock extends BlockLike {
  type: BlockType.VideoEmbed;
  url: string | null;
  provider: string;
}

export interface AudioBlock {
  type: BlockType.Audio;
  url: string | null;
}

export type Block =
  | TextBlock
  | FileBlock
  | ImageBlock
  | VideoEmbedBlock
  | AudioBlock;

// Base Block Schema
const BlockBaseSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(BlockType),
      required: true,
    },
    index: {
      type: Number,
      required: true,
      min: 0,
    },
    page: {
      type: Schema.Types.ObjectId,
      ref: "Page",
      required: [true, "`page` is required"],
    },
  },
  { discriminatorKey: "type", timestamps: true },
);

// Specific Block Schemas
const TextBlockSchema = new Schema({
  content: { type: String, required: false, default: "" },
});

const FileBlockSchema = new Schema({
  url: { type: String, required: false },
  description: { type: String, required: false },
  fileName: { type: String, required: false },
  fileSize: { type: Number, required: false },
});

const ImageBlockSchema = new Schema({
  url: { type: String, required: false },
  description: { type: String, required: false },
});

const VideoEmbedBlockSchema = new Schema({
  url: { type: String, required: false },
  provider: { type: String, required: true },
});

const AudioBlockSchema = new Schema({
  url: { type: String, required: false },
  description: { type: String, required: false },
});

// Block Model and Discriminators
export const BlockModel: Model<Block> =
  mongoose.models?.Block || model("Block", BlockBaseSchema);

if (!BlockModel.discriminators?.[BlockType.Text]) {
  BlockModel?.discriminator?.(BlockType.Text, TextBlockSchema);
}

if (!BlockModel.discriminators?.[BlockType.File])
  BlockModel.discriminator?.(BlockType.File, FileBlockSchema);

if (!BlockModel.discriminators?.[BlockType.Image])
  BlockModel.discriminator?.(BlockType.Image, ImageBlockSchema);

if (!BlockModel.discriminators?.[BlockType.VideoEmbed])
  BlockModel.discriminator?.(BlockType.VideoEmbed, VideoEmbedBlockSchema);

if (!BlockModel.discriminators?.[BlockType.Audio])
  BlockModel.discriminator?.(BlockType.Audio, AudioBlockSchema);

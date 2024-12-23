import { z } from "zod";

export const PageSchema = z.object({
  product: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "`product` must be a valid ObjectId"),
  createdBy: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "`createdBy` must be a valid ObjectId"),
  name: z.string().min(1),
  coverUrl: z.string().nullable(),
  content: z.string(),
  index: z.number().min(0, "`index` must be greater than or equal to 0"),
});

// Validation schema for creating a new Page
export const CreatePageServerSchema = PageSchema.omit({
  createdBy: true,
  content: true,
}).extend({
  createdBy: z.string().regex(/^[0-9a-fA-F]{24}$/, "`createdBy` is required"),
  content: z.string().nullable(),
});

export const CreatePageClientSchema = PageSchema.omit({
  createdBy: true,
});

// Validation schema for updating a Page
export const UpdatePageServerSchema = PageSchema.partial();

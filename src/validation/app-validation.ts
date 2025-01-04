import { z } from "zod";

export const AppSchema = z
  .object({
    name: z.string().min(1, "O nome é obrigatório"),
    colorScheme: z.string(),
    logoUrl: z.string().nullable(),
    bannerUrl: z.string().nullable(),
    description: z.string().nullable(),
    language: z.string().nullable(),
    supportEmail: z.string().nullable(),
    createdBy: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "`createdBy` must be a valid ObjectId"),
  })
  .required();

export const CreateAppSchema = AppSchema.omit({ createdBy: true });

export const UpdateAppSchema = AppSchema.partial();

import { UpdateAppSchema } from "@/validation/app-validation";
import { z } from "zod";
import {
  UseMutationOptions,
  useMutation as useRQMutation,
} from "@tanstack/react-query";
import { http } from "@/lib/http";
import { AxiosError } from "axios";
import { AppDocument } from "@/models/app-model";

export namespace UpdateAppMutation {
  export type Variables = z.infer<typeof UpdateAppSchema> & { id: string };
  export type Data = AppDocument;
  export type Error = AxiosError;

  export const mutationKey = ["update", "app"];

  const mutationFn = ({ id, ...data }: Variables) =>
    http.put(`/apps/${id}`, data).then((res) => res.data);

  export const useMutation = (
    options: UseMutationOptions<Data, Error, Variables> = {},
  ) => {
    return useRQMutation({
      ...options,
      mutationKey,
      mutationFn,
    });
  };
}

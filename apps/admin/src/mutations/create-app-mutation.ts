import { CreateAppSchema } from "@shared/validation/app-validation";
import { z } from "zod";
import {
  UseMutationOptions,
  useMutation as useRQMutation,
} from "@tanstack/react-query";
import { http } from "@shared/lib/http";
import { AxiosError } from "axios";
import { AppDocument } from "@shared/models/app-model";

export namespace CreateAppMutation {
  export type Variables = z.infer<typeof CreateAppSchema>;
  export type Data = AppDocument;
  export type Error = AxiosError;

  export const mutationKey = ["create", "app"];

  const mutationFn = (data: Variables) =>
    http.post("/apps", data).then((res) => res.data);

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

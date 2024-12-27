import { http } from "@/lib/http";
import { AxiosError } from "axios";
import { z } from "zod";
import {
  UseMutationOptions,
  useMutation as useRQMutation,
} from "@tanstack/react-query";
import { CreatePageClientSchema } from "@/validation/page-validation";
import { PageDocument } from "@/models";

export namespace CreatePageMutation {
  export type Variables = z.infer<typeof CreatePageClientSchema>;
  export type Data = PageDocument;
  export type Error = AxiosError;

  export const mutationKey = ["create", "page"];

  export const mutationFn = (variables: Variables) =>
    http.post(`/pages`, variables).then((res) => res.data);

  export const useMutation = (
    options: UseMutationOptions<Data, Error, Variables> = {},
  ) =>
    useRQMutation({
      ...options,
      mutationKey,
      mutationFn,
    });
}

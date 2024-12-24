import { http } from "@/lib/http";
import { AxiosError } from "axios";
import { z } from "zod";
import {
  UseMutationOptions,
  useMutation as useRQMutation,
} from "@tanstack/react-query";
import { UpdatePageClientSchema } from "@/validation/page-validation";
import { PageDocument } from "@/models";

export namespace UpdatePageMutation {
  export type Variables = {
    pageId?: string;
  } & z.infer<typeof UpdatePageClientSchema>;
  export type Data = PageDocument;
  export type Error = AxiosError;

  export const mutationKey = ["update", "page"];

  export const mutationFn = ({ pageId, ...variables }: Variables) =>
    http.put(`/pages/${pageId}`, variables).then((res) => res.data);

  export const useMutation = (
    options: UseMutationOptions<Data, Error, Variables> = {},
  ) =>
    useRQMutation({
      ...options,
      mutationKey,
      mutationFn,
    });
}

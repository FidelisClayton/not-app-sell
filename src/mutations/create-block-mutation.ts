import { http } from "@/lib/http";
import { AxiosError } from "axios";
import {
  UseMutationOptions,
  useMutation as useRQMutation,
} from "@tanstack/react-query";
import { Block } from "@/models/block-model";

export namespace CreateBlockMutation {
  export type Variables = { pageId?: string } & Omit<Block, "_id">;
  export type Data = Block;
  export type Error = AxiosError;

  export const mutationKey = ["create", "block"];

  export const mutationFn = ({ pageId, ...variables }: Variables) =>
    http.post(`/pages/${pageId}/blocks`, variables).then((res) => res.data);

  export const useMutation = (
    options: UseMutationOptions<Data, Error, Variables> = {},
  ) =>
    useRQMutation({
      ...options,
      mutationKey,
      mutationFn,
    });
}

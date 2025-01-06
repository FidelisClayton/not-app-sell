import { http } from "@shared/lib/http";
import { AxiosError } from "axios";
import {
  UseMutationOptions,
  useMutation as useRQMutation,
} from "@tanstack/react-query";
import { Block } from "@shared/models/block-model";

export namespace UpdateBlockMutation {
  export type Variables = { blockId?: string } & Partial<Omit<Block, "_id">>;
  export type Data = Block;
  export type Error = AxiosError;

  export const mutationKey = ["update", "block"];

  export const mutationFn = ({ blockId, ...variables }: Variables) =>
    http.put(`/blocks/${blockId}`, variables).then((res) => res.data);

  export const useMutation = (
    options: UseMutationOptions<Data, Error, Variables> = {},
  ) =>
    useRQMutation({
      ...options,
      mutationKey,
      mutationFn,
    });
}

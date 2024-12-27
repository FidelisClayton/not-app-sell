import { http } from "@/lib/http";
import { AxiosError } from "axios";
import {
  UseMutationOptions,
  useMutation as useRQMutation,
} from "@tanstack/react-query";
import { Block, BlockType } from "@/models/block-model";

export namespace ReorderBlockMutation {
  export type Variables = { blockId: string; index: number; type: BlockType };
  export type Data = Block;
  export type Error = AxiosError;

  export const mutationKey = ["blocks", "reorder"];

  export const mutationFn = (variables: Variables) =>
    http.put(`/blocks/reorder`, variables).then((res) => res.data);

  export const useMutation = (
    options: UseMutationOptions<Data, Error, Variables> = {},
  ) =>
    useRQMutation({
      ...options,
      mutationKey,
      mutationFn,
    });
}

import { http } from "@/lib/http";
import { AxiosError } from "axios";
import {
  UseMutationOptions,
  useMutation as useRQMutation,
} from "@tanstack/react-query";
import { Block } from "@/models/block-model";

export namespace DeleteBlockMutation {
  export type Variables = { blockId?: string };
  export type Data = Block;
  export type Error = AxiosError;

  export const mutationKey = ["update", "block"];

  export const mutationFn = ({ blockId }: Variables) =>
    http.delete(`/blocks/${blockId}`).then((res) => res.data);

  export const useMutation = (
    options: UseMutationOptions<Data, Error, Variables> = {},
  ) =>
    useRQMutation({
      ...options,
      mutationKey,
      mutationFn,
    });
}

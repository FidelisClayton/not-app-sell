import { http } from "@shared/lib/http";
import { AxiosError } from "axios";
import {
  UseMutationOptions,
  useMutation as useRQMutation,
} from "@tanstack/react-query";
import { Block } from "@shared/models/block-model";

export namespace DeleteProductMutation {
  export type Variables = { productId?: string };
  export type Data = Block;
  export type Error = AxiosError;

  export const mutationKey = ["delete", "product"];

  export const mutationFn = ({ productId }: Variables) =>
    http.delete(`/products/${productId}`).then((res) => res.data);

  export const useMutation = (
    options: UseMutationOptions<Data, Error, Variables> = {},
  ) =>
    useRQMutation({
      ...options,
      mutationKey,
      mutationFn,
    });
}

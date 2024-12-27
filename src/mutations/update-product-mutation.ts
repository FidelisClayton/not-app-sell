import { http } from "@/lib/http";
import {
  UpdateProductClientSchema,
  ProductDocument,
} from "@/models/product-model";
import { AxiosError } from "axios";
import { z } from "zod";
import {
  UseMutationOptions,
  useMutation as useRQMutation,
} from "@tanstack/react-query";

export namespace UpdateProductMutation {
  export type Variables = { productId: string } & z.infer<
    typeof UpdateProductClientSchema
  >;
  export type Data = ProductDocument;
  export type Error = AxiosError;

  export const mutationKey = ["create", "product"];

  export const mutationFn = ({ productId, ...variables }: Variables) =>
    http.put(`/products/${productId}`, variables).then((res) => res.data);

  export const useMutation = (
    options: UseMutationOptions<Data, Error, Variables> = {},
  ) =>
    useRQMutation({
      ...options,
      mutationKey,
      mutationFn,
    });
}

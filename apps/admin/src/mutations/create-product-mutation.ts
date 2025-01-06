import { http } from "@shared/lib/http";
import {
  CreateProductClientSchema,
  ProductDocument,
} from "@shared/models/product-model";
import { AxiosError } from "axios";
import { z } from "zod";
import {
  UseMutationOptions,
  useMutation as useRQMutation,
} from "@tanstack/react-query";

export namespace CreateProductMutation {
  export type Variables = z.infer<typeof CreateProductClientSchema>;
  export type Data = ProductDocument;
  export type Error = AxiosError;

  export const mutationKey = ["create", "product"];

  export const mutationFn = (variables: Variables) =>
    http.post(`/products`, variables).then((res) => res.data);

  export const useMutation = (
    options: UseMutationOptions<Data, Error, Variables> = {},
  ) =>
    useRQMutation({
      ...options,
      mutationKey,
      mutationFn,
    });
}

import { http } from "@shared/lib/http";
import { AxiosError } from "axios";
import {
  UseMutationOptions,
  useMutation as useRQMutation,
} from "@tanstack/react-query";

export namespace CreateUploadUrlMutation {
  export type Variables = { fileName: string; fileType: string };
  export type Data = { uploadUrl: string };
  export type Error = AxiosError;

  export const mutationKey = ["create", "upload", "url"];

  export const mutationFn = (variables: Variables) =>
    http.post(`/upload/url`, variables).then((res) => res.data);

  export const useMutation = (
    options: UseMutationOptions<Data, Error, Variables> = {},
  ) =>
    useRQMutation({
      ...options,
      mutationKey,
      mutationFn,
    });
}

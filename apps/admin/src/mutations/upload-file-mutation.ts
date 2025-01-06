import { http } from "@shared/lib/http";
import { AxiosError } from "axios";
import {
  UseMutationOptions,
  useMutation as useRQMutation,
} from "@tanstack/react-query";

export namespace UploadFileMutation {
  export type Variables = { uploadUrl: string; file: File };
  export type Data = any;
  export type Error = AxiosError;

  export const mutationKey = ["upload", "file"];

  export const mutationFn = ({ uploadUrl, file }: Variables) =>
    http
      .put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      })
      .then((res) => res.data);

  export const useMutation = (
    options: UseMutationOptions<Data, Error, Variables> = {},
  ) =>
    useRQMutation({
      ...options,
      mutationKey,
      mutationFn,
    });
}

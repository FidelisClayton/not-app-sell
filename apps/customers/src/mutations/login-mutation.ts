import { http } from "@shared/lib/http";
import { AxiosError } from "axios";
import {
  UseMutationOptions,
  useMutation as useRQMutation,
} from "@tanstack/react-query";

export namespace LoginMutation {
  export type Variables = {
    email: string;
    appId: string;
    csrfToken: string;
    callbackUrl: string;
    basePath: string;
    json: boolean;
  };
  export type Data = void;
  export type Error = AxiosError<{ url: string }>;

  export const mutationKey = ["login"];

  export const mutationFn = async (variables: Variables) => {
    return http
      .post("/auth/callback/credentials", variables, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Auth-Return-Redirect": "1",
        },
      })
      .then((res) => res.data);
  };

  export const useMutation = (
    options: UseMutationOptions<Data, Error, Variables> = {},
  ) =>
    useRQMutation({
      ...options,
      mutationKey,
      mutationFn,
    });
}

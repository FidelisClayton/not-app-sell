import {
  UseMutationOptions,
  useMutation as useRQMutation,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export namespace DownloadFileMutation {
  export type Variables = { fileUrl: string; fileName: string };
  export type Data = any;
  export type Error = AxiosError;

  export const mutationKey = ["create", "app"];

  const mutationFn = async ({
    fileUrl,
    fileName,
  }: {
    fileUrl: string;
    fileName: string;
  }) => {
    try {
      // Step 1: Fetch the file as a blob
      const response = await axios.get(fileUrl, {
        responseType: "blob", // Ensure the response is a Blob
      });

      // Step 2: Create a Blob URL
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

      // Step 3: Create a link and trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName); // Set the downloaded file name
      document.body.appendChild(link);
      link.click();

      // Step 4: Cleanup
      link.remove();
      window.URL.revokeObjectURL(blobUrl); // Revoke the Blob URL after the download
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file");
    }
  };

  export const useMutation = (
    options: UseMutationOptions<Data, Error, Variables> = {},
  ) => {
    return useRQMutation({
      ...options,
      mutationKey,
      mutationFn,
    });
  };
}

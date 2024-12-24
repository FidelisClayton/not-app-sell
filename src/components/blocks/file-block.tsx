import { FileBlock as TFileBlock } from "@/models/block-model";
import { CreateUploadUrlMutation } from "@/mutations/create-upload-url-mutation";
import { UpdateBlockMutation } from "@/mutations/update-block-mutation";
import { UploadFileMutation } from "@/mutations/upload-file-mutation";
import {
  Box,
  Center,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { ChangeEvent } from "react";
import prettyBytes from "pretty-bytes";
import { GetBlocksQuery } from "@/queries/get-blocks-query";
import { FaFile, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { DownloadFileMutation } from "@/mutations/download-file-mutation";
import { DeleteBlockMutation } from "@/mutations/delete-block-mutation";

export type FileBlockProps = {
  block: TFileBlock;
};

export const FileBlock = ({ block }: FileBlockProps) => {
  const queryClient = useQueryClient();
  const updateBlockMutation = UpdateBlockMutation.useMutation({});
  const createUploadUrlMutation = CreateUploadUrlMutation.useMutation({});
  const uploadFileMutation = UploadFileMutation.useMutation({});
  const downloadFileMutation = DownloadFileMutation.useMutation({});
  const deleteBlockMutation = DeleteBlockMutation.useMutation({
    onSuccess: () => {
      GetBlocksQuery.invalidate(queryClient, { pageId: block.page });
    },
  });

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const [file] = e.target.files;
    console.log(file.size, file.name, file.type);

    try {
      const { uploadUrl } = await createUploadUrlMutation.mutateAsync({
        fileName: `${block.type.toLowerCase()}_block_${block._id}_${file.name}`,
        fileType: file.type,
      });

      const objectUrl = uploadUrl.split("?")[0];

      await uploadFileMutation.mutateAsync({
        file,
        uploadUrl,
      });

      await updateBlockMutation.mutateAsync({
        ...block,
        blockId: block._id,
        url: objectUrl,
        fileName: file.name,
        fileSize: file.size,
      } as Partial<TFileBlock & { blockId: string }>);

      await GetBlocksQuery.invalidate(queryClient, { pageId: block.page });
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleDownload = () => {
    if (block.fileName && block.url)
      downloadFileMutation.mutate({
        fileName: block.fileName,
        fileUrl: block.url,
      });
  };

  const handleDelete = () => {
    deleteBlockMutation.mutate({ blockId: block._id });
  };

  return (
    <HStack
      position="relative"
      w="full"
      py="2"
      _hover={{
        ".block__delete-button": {
          opacity: 1,
        },
      }}
    >
      {block.fileName && block.fileSize && block.url ? (
        <HStack cursor="pointer" onClick={handleDownload} w="full">
          <Center h={10} w={10} bgColor="slate.900" color="slate.200">
            <FaFile />
          </Center>
          <VStack spacing={0} alignItems="stretch">
            <Text>{block.fileName}</Text>
            <Text mt={-1} fontSize="xs" color="slate.500">
              {prettyBytes(block.fileSize)}
            </Text>
          </VStack>
        </HStack>
      ) : (
        <Input onChange={handleChange} type="file" />
      )}

      <IconButton
        className="block__delete-button"
        size="xs"
        icon={<FaTrash />}
        onClick={handleDelete}
        aria-label="Delete block"
        opacity={0}
      />
    </HStack>
  );
};

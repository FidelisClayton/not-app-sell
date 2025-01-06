import { FileBlock as TFileBlock } from "@shared/models/block-model";
import { Center, HStack, Text, VStack } from "@chakra-ui/react";
import prettyBytes from "pretty-bytes";
import { FaFile } from "react-icons/fa";
import { DownloadFileMutation } from "@/mutations/download-file-mutation";

export type FileBlockProps = {
  block: TFileBlock;
};

export const FileBlock = ({ block }: FileBlockProps) => {
  const downloadFileMutation = DownloadFileMutation.useMutation({});

  const handleDownload = () => {
    if (block.fileName && block.url)
      downloadFileMutation.mutate({
        fileName: block.fileName,
        fileUrl: block.url,
      });
  };

  if (!block.url || !block.fileName || !block.fileSize) return null;

  return (
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
  );
};

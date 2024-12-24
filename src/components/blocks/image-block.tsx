import { http } from "@/lib/http";
import { ImageBlock as TImageBlock } from "@/models/block-model";
import { CreateUploadUrlMutation } from "@/mutations/create-upload-url-mutation";
import { UpdateBlockMutation } from "@/mutations/update-block-mutation";
import { UploadFileMutation } from "@/mutations/upload-file-mutation";
import { GetBlocksQuery } from "@/queries/get-blocks-query";
import { AspectRatio, Box, Image, Input, Text, VStack } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useRef, useState } from "react";

export type ImageBlockProps = {
  block: TImageBlock;
};

export const ImageBlock = ({ block }: ImageBlockProps) => {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const updateBlockMutation = UpdateBlockMutation.useMutation({});
  const createUploadUrlMutation = CreateUploadUrlMutation.useMutation({});
  const uploadFileMutation = UploadFileMutation.useMutation({});

  const uploadFile = async (file: File) => {
    if (!file) {
      return alert("Please select a file");
    }

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
        url: objectUrl,
        blockId: block._id,
        description: block.description ?? "",
      } as Partial<TImageBlock & { blockId: string }>);

      await GetBlocksQuery.invalidate(queryClient, {
        pageId: block.page,
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("File upload failed");
    }
  };

  const handleClick = () => {
    console.log(inputRef.current);
    inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    uploadFile(file);
  };

  return (
    <Box w="full">
      {block.url ? (
        <Image src={block.url} />
      ) : (
        <AspectRatio w="full" ratio={16 / 9}>
          <VStack
            onClick={handleClick}
            w="full"
            alignItems="center"
            justifyContent="center"
            spacing={0}
            bgColor="slate.100"
            borderRadius="md"
            cursor="pointer"
          >
            <Text textAlign="center" w="full">
              Arraste sua imagem aqui
            </Text>
            <Text textAlign="center" fontSize="sm" w="full">
              ou clique para fazer upload
            </Text>
          </VStack>
        </AspectRatio>
      )}
      {block.description && <Text size="xs">{block.description}</Text>}

      <Input
        ref={inputRef}
        onChange={handleChange}
        type="file"
        position="absolute"
        display="none"
      />
    </Box>
  );
};

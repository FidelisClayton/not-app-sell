import { ImageBlock as TImageBlock } from "@/models/block-model";
import { UpdateBlockMutation } from "@/mutations/update-block-mutation";
import { GetBlocksQuery } from "@/queries/get-blocks-query";
import { Box, Image, Text } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { BlockWrapper } from "../block-wrapper";
import { ImageUpload } from "../image-upload/image-upload";

export type ImageBlockProps = {
  block: TImageBlock;
};

export const ImageBlock = ({ block }: ImageBlockProps) => {
  const queryClient = useQueryClient();
  const updateBlockMutation = UpdateBlockMutation.useMutation({});

  return (
    <BlockWrapper block={block}>
      <Box w="full">
        {block.url ? (
          <Image borderRadius="lg" src={block.url} />
        ) : (
          <ImageUpload
            onSuccess={async ({ objectUrl }) => {
              await updateBlockMutation.mutateAsync({
                ...block,
                url: objectUrl,
                blockId: block._id,
                description: block.description ?? "",
                page: block.page,
              } as Partial<TImageBlock & { blockId: string }>);

              await GetBlocksQuery.invalidate(queryClient, {
                pageId: block.page,
              });
            }}
            isLoading={updateBlockMutation.isPending}
          />
        )}
        {block.description && <Text size="xs">{block.description}</Text>}
      </Box>
    </BlockWrapper>
  );
};

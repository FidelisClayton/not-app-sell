import { ImageBlock as TImageBlock } from "@shared/models/block-model";
import { Box, Image } from "@chakra-ui/react";

export type ImageBlockProps = {
  block: TImageBlock;
};

export const ImageBlock = ({ block }: ImageBlockProps) => {
  if (!block.url) return null;

  return (
    <Box w="full">
      <Image borderRadius="lg" src={block.url} />
    </Box>
  );
};

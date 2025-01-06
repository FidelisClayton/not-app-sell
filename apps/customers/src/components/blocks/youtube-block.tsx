import { VideoEmbedBlock } from "@shared/models";
import { UpdateBlockMutation } from "@/mutations/update-block-mutation";
import { GetBlocksQuery } from "@/queries/get-blocks-query";
import { Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { z } from "zod";
import "plyr-react/plyr.css";
import { BlockWrapper } from "../block-wrapper";
import { VideoPlayer } from "../video-player";

export type YoutubeBlockProps = {
  block: VideoEmbedBlock;
};

const urlSchema = z.string().url();
export const YoutubeBlock = ({ block }: YoutubeBlockProps) => {
  const isValid = useMemo(() => {
    try {
      urlSchema.parse(block.url);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }, [block.url]);

  if (!block.url || !isValid) return null;

  return (
    <VStack
      w="full"
      spacing={1}
      alignItems="flex-start"
      sx={{
        ".plyr--video": {
          w: "full",
        },
      }}
    >
      <VideoPlayer url={block.url} provider="Youtube" id={block._id} />
    </VStack>
  );
};

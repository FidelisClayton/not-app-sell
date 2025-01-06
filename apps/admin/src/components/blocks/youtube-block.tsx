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
  const [url, setUrl] = useState<string>(block.url ?? "");

  const queryClient = useQueryClient();
  const updateBlockMutation = UpdateBlockMutation.useMutation({
    onSuccess: () => {
      GetBlocksQuery.invalidate(queryClient, { pageId: block.page });
    },
  });

  const isValid = useMemo(() => {
    try {
      urlSchema.parse(url);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }, [url]);

  return (
    <BlockWrapper block={block}>
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
        {block.url ? (
          <VideoPlayer url={block.url} provider="Youtube" id={block._id} />
        ) : (
          <>
            <Text fontSize="sm" color="gray.500">
              Link do vídeo no Youtube
            </Text>
            <HStack spacing={2} w="full">
              <Input
                borderRadius="md"
                placeholder="Cole o link do video aqui"
                size="sm"
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
              />

              <Button
                isDisabled={!isValid}
                onClick={() => {
                  if (isValid) {
                    updateBlockMutation.mutate({
                      ...block,
                      url,
                      blockId: block._id,
                    } as VideoEmbedBlock);
                  }
                }}
                variant="solidDark"
                size="sm"
                isLoading={updateBlockMutation.isPending}
              >
                Salvar
              </Button>
            </HStack>
          </>
        )}
      </VStack>
    </BlockWrapper>
  );
};

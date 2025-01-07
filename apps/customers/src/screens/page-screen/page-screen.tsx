import { FileBlock } from "@/components/blocks/file-block";
import { ImageBlock } from "@/components/blocks/image-block";
import { TextBlock } from "@/components/blocks/text-block";
import { VimeoBlock } from "@/components/blocks/vimeo-block";
import { YoutubeBlock } from "@/components/blocks/youtube-block";
import { TopMenu } from "@/components/top-menu";
import { CompletePageMutation } from "@/mutations/complete-page-mutation";
import { GetBlocksQuery } from "@/queries/get-blocks-query";
import { GetPageQuery } from "@/queries/get-page-query";
import { GetPagesQuery } from "@/queries/get-pages-query";
import {
  AspectRatio,
  Box,
  Button,
  Container,
  Grid,
  Heading,
  Image,
  VStack,
} from "@chakra-ui/react";
import { BlockType } from "@shared/models/block-model";
import Link from "next/link";
import { useRouter } from "next/router";
import { match } from "ts-pattern";

export const PageScreen = () => {
  const router = useRouter();
  const { appId, pageId, productId } = router.query;
  const pagesQuery = GetPagesQuery.useQuery({
    productId: productId?.toString(),
  });
  const blocksQuery = GetBlocksQuery.useQuery({ pageId: pageId?.toString() });
  const pageQuery = GetPageQuery.useQuery({ pageId: pageId?.toString() });

  const completePageMutation = CompletePageMutation.useMutation({
    onSuccess: () => {
      if (!pageQuery.data) return;

      const nextPageIndex = pageQuery.data?.index + 1;
      const nextPage = pagesQuery.data?.find(
        (page) => page.index === nextPageIndex,
      );

      router.push(
        nextPage
          ? `/apps/${appId}/products/${productId}/pages/${nextPage._id}`
          : `/apps/${appId}/products/${productId}`,
      );
    },
  });

  if (!pageQuery.data) return null;

  const nextPageIndex = pageQuery.data.index + 1;
  const nextPage = pagesQuery.data?.find(
    (page) => page.index === nextPageIndex,
  );

  const handleComplete = () => {
    if (pageId) {
      completePageMutation.mutate({ pageId: pageId.toString() });
    }
  };

  return (
    <Grid h="100vh" gridTemplateRows="1fr" w="full" gap={0}>
      <TopMenu
        position="fixed"
        top="0"
        h="64px"
        left="0"
        w="full"
        backLink={`/apps/${appId}/products/${productId}`}
      />

      <VStack pt="64px">
        {pageQuery.data?.coverUrl && (
          <Box w="full" overflow="hidden">
            <AspectRatio ratio={16 / 9}>
              <Image objectFit="cover" src={pageQuery.data.coverUrl} />
            </AspectRatio>
          </Box>
        )}

        <Container bgColor="white" maxW="lg" pb="8" px="8">
          {pageQuery.data && (
            <VStack
              alignItems="flex-start"
              w="full"
              pt={pageQuery.data.coverUrl ? 0 : 4}
            >
              <Heading size="lg" w="full" textAlign="left">
                {pageQuery.data.name}
              </Heading>
            </VStack>
          )}

          {blocksQuery.data && (
            <VStack w="full">
              {blocksQuery.data.map((block) =>
                match(block)
                  .with({ type: BlockType.Text }, (block) => (
                    <TextBlock key={block._id} block={block} />
                  ))
                  .with({ type: BlockType.Image }, (block) => (
                    <ImageBlock key={block._id} block={block} />
                  ))
                  .with({ type: BlockType.File }, (block) => (
                    <FileBlock key={block._id} block={block} />
                  ))
                  .with(
                    { type: BlockType.VideoEmbed, provider: "Youtube" },
                    (block) => <YoutubeBlock key={block._id} block={block} />,
                  )
                  .with(
                    { type: BlockType.VideoEmbed, provider: "Vimeo" },
                    (block) => <VimeoBlock key={block._id} block={block} />,
                  )
                  .otherwise(() => null),
              )}
            </VStack>
          )}

          <Button
            mt={4}
            w="full"
            borderRadius="xl"
            colorScheme="green"
            size="lg"
            fontSize="sm"
            onClick={handleComplete}
          >
            {nextPage ? "Continuar" : "Completar"}
          </Button>
        </Container>
      </VStack>
    </Grid>
  );
};

import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { FaArrowLeft, FaFile, FaFont, FaImage, FaSadCry } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { ProductUpsertModal } from "@/components/product-upsert-modal";
import { CreateProductMutation } from "@/mutations/create-product-mutation";
import { z } from "zod";
import { CreateProductClientSchema } from "@/models/product-model";
import { GetProductsQuery } from "@/queries/get-products-query";
import { useRouter } from "next/router";
import { GetPagesQuery } from "@/queries/get-pages-query";
import { PageUpsertModal } from "@/components/page-upsert-modal";
import { CreatePageClientSchema } from "@/validation/page-validation";
import { CreatePageMutation } from "@/mutations/create-page-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { GetPageQuery } from "@/queries/get-page-query";
import { UpdatePageMutation } from "@/mutations/update-page-mutation";
import { useRef } from "react";
import { Editor } from "@tiptap/core";
import { Block, BlockType } from "@/models/block-model";
import { GetBlocksQuery } from "@/queries/get-blocks-query";
import { match } from "ts-pattern";
import { BSON } from "bson";
import { TextBlock } from "@/components/blocks/text-block";
import { ImageBlock } from "@/components/blocks/image-block";
import { FileBlock } from "@/components/blocks/file-block";
import { CreateBlockMutation } from "@/mutations/create-block-mutation";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BlockMenuItem } from "@/components/block-menu-item";

const BLOCKS = [
  {
    Icon: FaFont,
    label: "Texto",
    blockType: BlockType.Text,
  },
  {
    Icon: FaImage,
    label: "Imagem",
    blockType: BlockType.Image,
  },
  {
    Icon: FaFile,
    label: "Arquivo",
    blockType: BlockType.File,
  },
];

const TOP_BAR_HEIGHT = 57;

export const ProductsScreen = () => {
  const { appId, productId, pageId } = useRouter().query;
  const toast = useToast();
  const createProductDisclosure = useDisclosure();
  const createPageDisclosure = useDisclosure();
  const queryClient = useQueryClient();
  const editorRef = useRef<Editor>(null);

  const productsQuery = GetProductsQuery.useQuery({ appId: appId?.toString() });
  const pagesQuery = GetPagesQuery.useQuery({
    productId: productId?.toString(),
  });
  const pageQuery = GetPageQuery.useQuery({
    pageId: pageId?.toString(),
  });
  const blocksQuery = GetBlocksQuery.useQuery({
    pageId: pageId?.toString(),
  });

  const createProductMutation = CreateProductMutation.useMutation({
    onSuccess: () => {
      createProductDisclosure.onClose();
      toast({
        status: "success",
        description: "Produto criado com sucesso.",
      });
    },
    onError: () => {
      toast({
        status: "error",
        description: "Não foi possível criar o produto. Tente novamente.",
      });
    },
  });

  const createPageMutation = CreatePageMutation.useMutation({
    onSuccess: () => {
      GetPagesQuery.invalidateQuery(queryClient, {
        productId: productId?.toString(),
      });
      createPageDisclosure.onClose();
      toast({
        status: "success",
        description: "Página criada com sucesso.",
      });
    },
    onError: () => {
      toast({
        status: "error",
        description: "Não foi possível criar a página. Tente novamente.",
      });
    },
  });

  const updatePageMutation = UpdatePageMutation.useMutation({});

  const createBlockMutation = CreateBlockMutation.useMutation({
    onSuccess: () => {
      GetBlocksQuery.invalidate(queryClient, {
        pageId: pageId?.toString(),
      });
    },
  });

  const handleProductCreate = (
    formValues: z.infer<typeof CreateProductClientSchema>,
  ) => {
    createProductMutation.mutate(formValues);
  };

  const handlePageCreate = (
    formValues: z.infer<typeof CreatePageClientSchema>,
  ) => {
    createPageMutation.mutate({
      ...formValues,
      appId: appId?.toString(),
      productId: productId?.toString(),
    });
  };

  const handleSavePage = () => {
    const content = editorRef.current?.getHTML();

    if (!content) return;

    updatePageMutation.mutate({
      pageId: pageId?.toString(),
      content,
    });
  };

  const handleAddBlock = (blockType: BlockType) => {
    if (!pageId) return;

    const _id = new BSON.ObjectId().toString("hex");
    const index = blocksQuery.data?.length ?? 0;
    const page = pageId.toString();

    const newBlock = match<BlockType, Block | null>(blockType)
      .with(BlockType.Text, (type) => ({
        _id,
        type,
        content: "",
        index,
        page,
      }))
      .with(BlockType.Image, (type) => ({
        _id,
        type,
        page,
        url: null,
        index,
      }))
      .with(BlockType.File, (type) => ({
        _id,
        type,
        page,
        url: null,
        index,
        fileName: null,
        fileSize: null,
      }))
      .otherwise(() => null);

    if (!newBlock) return;

    createBlockMutation.mutate({
      ...newBlock,
      pageId: pageId?.toString(),
    });

    GetBlocksQuery.setQueryData(
      queryClient,
      { pageId: pageId?.toString() },
      (existingBlocks = []) => {
        if (!pageId?.toString()) return existingBlocks;

        if (!newBlock) return existingBlocks;

        return [...existingBlocks, newBlock];
      },
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {createProductDisclosure.isOpen && (
        <ProductUpsertModal
          onSubmit={handleProductCreate}
          disclosure={createProductDisclosure}
        />
      )}

      {createPageDisclosure.isOpen && (
        <PageUpsertModal
          onSubmit={handlePageCreate}
          disclosure={createPageDisclosure}
          index={pagesQuery.data?.length ?? 0}
        />
      )}
      <HStack
        justifyContent="space-between"
        alignItems="center"
        borderBottomStyle="solid"
        borderBottomColor="gray.100"
        borderBottomWidth="1px"
        px={4}
        py={2}
        bgColor="white"
      >
        <IconButton
          variant="ghost"
          aria-label="Voltar"
          color="gray.500"
          icon={<FaArrowLeft />}
          as={Link}
          href="/apps"
        />

        <HStack>
          <Button variant="ghost" as={Link} href={`/apps/${appId?.toString()}`}>
            Design
          </Button>
          <Button>Produtos</Button>
        </HStack>

        <Button onClick={handleSavePage} variant="solidDark">
          Salvar
        </Button>
      </HStack>

      <Grid
        gridTemplateColumns="300px 200px 1fr 200px"
        bgColor="gray.50"
        alignItems="flex-start"
      >
        <VStack
          w="full"
          boxShadow="md"
          spacing={6}
          h={`calc(100vh - ${TOP_BAR_HEIGHT}px)`}
          bgColor="white"
          alignItems="stretch"
        >
          {productsQuery.data?.map((product) => (
            <HStack
              as={Link}
              href={`/apps/${appId?.toString()}/products/${product._id}`}
              key={product._id}
              cursor="pointer"
              w="full"
              px="4"
              py="2"
              bgColor={
                product._id === productId?.toString() ? "slate.100" : undefined
              }
            >
              <Image borderRadius="md" maxW="12" src={product.coverUrl} />
              <VStack spacing={0}>
                <Text>{product.name}</Text>
                <Text>{product.description}</Text>
              </VStack>
            </HStack>
          ))}

          <Button
            onClick={createProductDisclosure.onOpen}
            leftIcon={<AiOutlinePlus />}
            fontSize="sm"
            borderRadius="none"
          >
            Novo produto
          </Button>
        </VStack>

        <VStack
          w="full"
          boxShadow="md"
          px="0"
          pb="4"
          spacing={1}
          bgColor="white"
          alignItems="stretch"
          h={`calc(100vh - ${TOP_BAR_HEIGHT}px)`}
        >
          {pagesQuery.data?.map((page) => (
            <Button
              as={Link}
              href={`/apps/${appId?.toString()}/products/${productId?.toString()}/pages/${page._id}`}
              variant="ghost"
              borderRadius="0"
              justifyContent="flex-start"
              fontWeight="normal"
              bgColor={
                page._id === pageId?.toString() ? "slate.100" : undefined
              }
            >
              <Text>{page.name}</Text>
            </Button>
          ))}

          {pagesQuery.data?.length === 0 && (
            <Text fontSize="sm" color="gray.700" textAlign="center">
              Este produto ainda não tem páginas.
            </Text>
          )}

          <Box w="full" pt={5}>
            <Button
              onClick={createPageDisclosure.onOpen}
              leftIcon={<AiOutlinePlus />}
              fontSize="sm"
              w="full"
              borderRadius="none"
            >
              Nova página
            </Button>
          </Box>
        </VStack>

        <Box
          w="full"
          h={`calc(100vh - ${TOP_BAR_HEIGHT}px)`}
          overflowY="auto"
          py="8"
        >
          {blocksQuery.data && (
            <Container
              mx="auto"
              maxW="lg"
              boxShadow="md"
              borderRadius="xl"
              bgColor="white"
            >
              <VStack w="full" minH="20" px="4" py="8" spacing={0}>
                {pageQuery.data && (
                  <Heading w="full" mb="4">
                    {pageQuery.data.name}
                  </Heading>
                )}

                {blocksQuery.data?.map((block) =>
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
                    .otherwise(() => null),
                )}

                {!blocksQuery.data?.length && (
                  <VStack
                    w="full"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                  >
                    <Text color="gray.500" textAlign="left">
                      Esta página está vazia, adicione blocos para customizá-la.
                    </Text>
                  </VStack>
                )}
              </VStack>
            </Container>
          )}
        </Box>

        <VStack
          w="full"
          bgColor="white"
          h={`calc(100vh - ${TOP_BAR_HEIGHT}px)`}
          boxShadow="md"
          alignItems="stretch"
          py={4}
        >
          <Text
            textTransform="uppercase"
            fontSize="sm"
            px={4}
            fontWeight="semibold"
            color="gray.500"
          >
            Blocos
          </Text>
          {BLOCKS.map((block) => (
            <BlockMenuItem
              key={block.blockType}
              {...block}
              onClick={handleAddBlock}
            />
          ))}
        </VStack>
      </Grid>
    </DndProvider>
  );
};

import {
  AspectRatio,
  Box,
  Button,
  Container,
  Grid,
  Heading,
  HStack,
  IconButton,
  Image,
  Spacer,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
  FaFile,
  FaFont,
  FaHome,
  FaImage,
  FaVimeo,
  FaYoutube,
} from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { ProductUpsertModal } from "@/components/product-upsert-modal";
import { CreateProductMutation } from "@/mutations/create-product-mutation";
import {
  CreateProductClientSchema,
  Product,
  UpdateProductClientSchema,
} from "@/models/product-model";
import { GetProductsQuery } from "@/queries/get-products-query";
import { useRouter } from "next/router";
import { GetPagesQuery } from "@/queries/get-pages-query";
import {
  PageUpsertModal,
  PageUpsertModalProps,
} from "@/components/page-upsert-modal";
import { CreatePageMutation } from "@/mutations/create-page-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { GetPageQuery } from "@/queries/get-page-query";
import { UpdatePageMutation } from "@/mutations/update-page-mutation";
import { useState } from "react";
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
import { Page } from "@/models";
import { UpdateProductMutation } from "@/mutations/update-product-mutation";
import { YoutubeBlock } from "@/components/blocks/youtube-block";
import { VimeoBlock } from "@/components/blocks/vimeo-block";
import { z } from "zod";
import { GetAppQuery } from "@/queries/get-app-query";

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
  {
    Icon: FaYoutube,
    label: "Youtube",
    blockType: BlockType.VideoEmbed,
    settings: {
      provider: "Youtube",
    },
  },
  {
    Icon: FaVimeo,
    label: "Vimeo",
    blockType: BlockType.VideoEmbed,
    settings: {
      provider: "Vimeo",
    },
  },
];

const TOP_BAR_HEIGHT = 57;

export const ProductsScreen = () => {
  const { appId, productId, pageId } = useRouter().query;
  const toast = useToast();
  const queryClient = useQueryClient();

  const [productToUpdate, setProductToEdit] = useState<Product | null>(null);
  const [pageToEdit, setPageToEdit] = useState<Page | null>(null);

  const createProductDisclosure = useDisclosure();
  const updateProductDisclosure = useDisclosure({
    onClose: () => setProductToEdit(null),
  });

  const createPageDisclosure = useDisclosure();
  const updatePageDisclosure = useDisclosure({
    onClose: () => setPageToEdit(null),
  });

  const appQuery = GetAppQuery.useQuery({ id: appId?.toString() });

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
        position: "top",
        status: "success",
        description: "Produto criado com sucesso.",
      });
    },
    onError: () => {
      toast({
        position: "top",
        status: "error",
        description: "Não foi possível criar o produto. Tente novamente.",
      });
    },
  });

  const updateProductMutation = UpdateProductMutation.useMutation({
    onSuccess: () => {
      toast({
        position: "top",
        status: "success",
        description: "Produto atualizado com sucesso.",
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
        position: "top",
        status: "success",
        description: "Página criada com sucesso.",
      });
    },
    onError: () => {
      toast({
        position: "top",
        status: "error",
        description: "Não foi possível criar a página. Tente novamente.",
      });
    },
  });

  const updatePageMutation = UpdatePageMutation.useMutation({
    onSuccess: () => {
      GetPagesQuery.invalidateQuery(queryClient, {
        productId: productId?.toString(),
      });
      toast({
        position: "top",
        status: "success",
        description: "Produto atualizado com sucesso",
      });
    },
  });

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
    formValues: Parameters<PageUpsertModalProps["onSubmit"]>[0],
  ) => {
    createPageMutation.mutate({
      ...formValues,
      coverUrl: formValues.coverUrl ?? null,
    });
  };

  const handlePageUpdate = (
    formValues: Parameters<PageUpsertModalProps["onSubmit"]>[0],
  ) => {
    if (!pageToEdit?._id) return;

    updatePageMutation.mutate({
      ...formValues,
      pageId: pageToEdit._id,
    });
  };

  const handleProductUpdate = (
    formValues: z.infer<typeof UpdateProductClientSchema>,
  ) => {
    if (!productToUpdate?._id) return;

    updateProductMutation.mutate({
      ...formValues,
      productId: productToUpdate._id,
    });
  };

  const handleAddBlock = (
    blockType: BlockType,
    settings: Record<string, any> = {},
  ) => {
    if (!pageId) return;

    const _id = new BSON.ObjectId().toString("hex");
    const index = blocksQuery.data?.length ?? 0;
    const page = pageId.toString();

    const newBlock = match<
      { blockType: BlockType; settings: Record<string, any> },
      Block | null
    >({ blockType, settings })
      .with({ blockType: BlockType.Text }, ({ blockType: type }) => ({
        _id,
        type,
        content: "",
        index,
        page,
      }))
      .with({ blockType: BlockType.Image }, ({ blockType: type }) => ({
        _id,
        type,
        page,
        url: null,
        index,
      }))
      .with({ blockType: BlockType.File }, ({ blockType: type }) => ({
        _id,
        type,
        page,
        url: null,
        index,
        fileName: null,
        fileSize: null,
      }))
      .with(
        { blockType: BlockType.VideoEmbed, settings: { provider: "Youtube" } },
        ({ blockType: type }) => ({
          _id,
          index,
          type,
          page,
          url: null,
          provider: "Youtube",
        }),
      )
      .with(
        { blockType: BlockType.VideoEmbed, settings: { provider: "Vimeo" } },
        ({ blockType: type }) => ({
          _id,
          index,
          type,
          page,
          url: null,
          provider: "Vimeo",
        }),
      )
      .otherwise(() => null);

    if (!newBlock) {
      return;
    }

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
          type="create"
          onSubmit={handleProductCreate}
          disclosure={createProductDisclosure}
          isLoading={createProductMutation.isPending}
        />
      )}

      {productToUpdate && updateProductDisclosure.isOpen && (
        <ProductUpsertModal
          type="update"
          product={productToUpdate}
          onSubmit={handleProductUpdate}
          disclosure={updateProductDisclosure}
          isLoading={updateProductMutation.isPending}
        />
      )}

      {createPageDisclosure.isOpen && (
        <PageUpsertModal
          type="create"
          onSubmit={handlePageCreate}
          disclosure={createPageDisclosure}
          index={pagesQuery.data?.length ?? 0}
          isLoading={createPageMutation.isPending}
        />
      )}

      {pageToEdit && updatePageDisclosure.isOpen && (
        <PageUpsertModal
          type="update"
          page={pageToEdit}
          onSubmit={handlePageUpdate}
          disclosure={updatePageDisclosure}
          index={pagesQuery.data?.length ?? 0}
          isLoading={updatePageMutation.isPending}
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

        <Button variant="solidDark">Publicar</Button>
      </HStack>

      <Grid
        gridTemplateColumns="300px 200px 1fr 200px"
        bgColor="gray.50"
        alignItems="flex-start"
      >
        <VStack
          w="full"
          boxShadow="md"
          spacing={0}
          h={`calc(100vh - ${TOP_BAR_HEIGHT}px)`}
          bgColor="white"
          alignItems="stretch"
        >
          {productsQuery.data?.map((product) => (
            <HStack
              as={Link}
              className="group"
              href={`/apps/${appId?.toString()}/products/${product._id}`}
              key={product._id}
              cursor="pointer"
              w="full"
              px="4"
              py="2"
              bgColor={
                product._id === productId?.toString() ? "slate.100" : undefined
              }
              justifyContent="space-between"
              _hover={{ bgColor: "slate.100" }}
            >
              <HStack>
                <Image borderRadius="md" maxW="12" src={product.coverUrl} />
                <VStack spacing={0} w="full" alignItems="stretch">
                  <Text noOfLines={1}>{product.name}</Text>
                  <Text fontSize="xs" color="gray.600" noOfLines={1}>
                    {product.description}
                  </Text>
                </VStack>
              </HStack>

              <IconButton
                aria-label="Configurações"
                variant="ghost"
                size="xs"
                icon={<FaCog />}
                display="none"
                _groupHover={{ display: "flex" }}
                _hover={{ bgColor: "white" }}
                onClick={(e) => {
                  e.preventDefault();
                  setProductToEdit(product);
                  updateProductDisclosure.onOpen();
                }}
              />
            </HStack>
          ))}

          <Button
            onClick={createProductDisclosure.onOpen}
            leftIcon={<AiOutlinePlus />}
            fontSize="sm"
            borderRadius="none"
            mt={4}
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
              key={page._id}
              as={Link}
              href={`/apps/${appId?.toString()}/products/${productId?.toString()}/pages/${page._id}`}
              variant="ghost"
              borderRadius="0"
              justifyContent="space-between"
              pr={1}
              fontWeight="normal"
              bgColor={
                page._id === pageId?.toString() ? "slate.100" : undefined
              }
              className="group"
              rightIcon={
                <IconButton
                  size="xs"
                  icon={<FaCog />}
                  display="none"
                  _groupHover={{ display: "flex" }}
                  aria-label="Configurações da página"
                  onClick={(e) => {
                    e.preventDefault();
                    setPageToEdit(page);
                    updatePageDisclosure.onOpen();
                  }}
                />
              }
            >
              <Text noOfLines={1}>{page.name}</Text>
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

        <Box w="full" h={`calc(100vh - ${TOP_BAR_HEIGHT}px)`} py="8">
          {blocksQuery.data && (
            <Container
              mx="auto"
              w="400px"
              maxW="full"
              boxShadow="md"
              borderRadius="xl"
              bgColor="white"
              px="0"
            >
              <Grid h="800px" gridTemplateRows="64px 1fr">
                <HStack
                  pointerEvents="none"
                  w="full"
                  borderBottom="1px"
                  borderColor="slate.200"
                  alignItems="center"
                  justifyContent="space-between"
                  px="4"
                >
                  <Box flex="1">
                    <IconButton
                      variant="unstyled"
                      aria-label="Voltar"
                      icon={<FaChevronLeft />}
                    />
                  </Box>

                  {appQuery.data?.logoUrl && (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      flex="1"
                    >
                      <Image
                        alt={appQuery.data.name}
                        src={appQuery.data.logoUrl}
                        w="12"
                      />
                    </Box>
                  )}

                  <Box flex="1" />
                </HStack>

                <VStack w="full" overflowY="auto" pb="4">
                  {pageQuery.data && (
                    <VStack w="full" pt={pageQuery.data.coverUrl ? 0 : 4}>
                      {pageQuery.data.coverUrl && (
                        <Box w="full" overflow="hidden">
                          <AspectRatio ratio={16 / 9}>
                            <Image
                              objectFit="cover"
                              src={pageQuery.data.coverUrl}
                            />
                          </AspectRatio>
                        </Box>
                      )}
                      <Heading size="lg" w="full" textAlign="left" px="8">
                        {pageQuery.data.name}
                      </Heading>
                    </VStack>
                  )}

                  {blocksQuery.data && (
                    <VStack w="full" px="8">
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
                            (block) => (
                              <YoutubeBlock key={block._id} block={block} />
                            ),
                          )
                          .with(
                            { type: BlockType.VideoEmbed, provider: "Vimeo" },
                            (block) => (
                              <VimeoBlock key={block._id} block={block} />
                            ),
                          )
                          .otherwise(() => null),
                      )}
                    </VStack>
                  )}

                  {!blocksQuery.data?.length && (
                    <VStack
                      w="full"
                      alignItems="flex-start"
                      justifyContent="flex-start"
                      px="8"
                    >
                      <Text color="gray.500" textAlign="center">
                        Esta página está vazia, adicione blocos para
                        customizá-la.
                      </Text>
                    </VStack>
                  )}
                </VStack>
              </Grid>
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

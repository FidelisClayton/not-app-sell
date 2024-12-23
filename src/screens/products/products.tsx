import {
  Box,
  Button,
  Grid,
  HStack,
  IconButton,
  Image,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { ProductUpsertModal } from "@/components/product-upsert-modal";
import { CreateProductMutation } from "@/mutations/create-product-mutation";
import { z } from "zod";
import { CreateProductClientSchema } from "@/models/product-model";
import { GetProductsQuery } from "@/queries/get-products-query";
import { useRouter } from "next/router";
import { FaFont, FaImage, FaVideo, FaVolumeLow } from "react-icons/fa6";
import { GetPagesQuery } from "@/queries/get-pages-query";
import { PageUpsertModal } from "@/components/page-upsert-modal";
import { CreatePageClientSchema } from "@/validation/page-validation";
import { CreatePageMutation } from "@/mutations/create-page-mutation";
import { useQueryClient } from "@tanstack/react-query";

export const ProductsScreen = () => {
  const { appId, productId } = useRouter().query;
  const toast = useToast();
  const createProductDisclosure = useDisclosure();
  const createPageDisclosure = useDisclosure();
  const queryClient = useQueryClient();

  const productsQuery = GetProductsQuery.useQuery({ appId: appId?.toString() });
  const pagesQuery = GetPagesQuery.useQuery({
    appId: appId?.toString(),
    productId: productId?.toString(),
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
        appId: appId?.toString(),
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

  return (
    <>
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
          <Button variant="ghost">Design</Button>
          <Button>Produtos</Button>
        </HStack>

        <Box />
      </HStack>

      <Grid
        gridTemplateColumns="300px 200px 1fr 200px"
        backgroundImage="radial-gradient(circle at 1px 1px, #0000003f 1px, transparent 0)"
        backgroundSize="20px 20px"
      >
        <VStack
          w="full"
          boxShadow="md"
          px="4"
          py="4"
          spacing={6}
          h="100vh"
          bgColor="white"
          alignItems="stretch"
        >
          {productsQuery.data?.map((product) => (
            <HStack key={product._id} cursor="pointer" w="full">
              <Image maxW="12" src={product.coverUrl} />
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
          h="100vh"
          bgColor="white"
          alignItems="stretch"
        >
          {pagesQuery.data?.map((page) => (
            <Button
              as={Link}
              href={`/apps/${appId?.toString()}/products/${productId?.toString()}/pages/${page._id}`}
              variant="ghost"
              borderRadius="0"
              justifyContent="flex-start"
              fontWeight="normal"
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
            >
              Nova página
            </Button>
          </Box>
        </VStack>

        <HStack w="full">
          <Text>Content</Text>
        </HStack>

        <VStack
          w="full"
          boxShadow="md"
          py="4"
          spacing={1}
          h="100vh"
          bgColor="white"
          alignItems="stretch"
        >
          <Button
            borderRadius="0"
            leftIcon={
              <Box
                bgColor="gray.100"
                borderRadius="md"
                px="1.5"
                fontSize="xs"
                py="1.5"
              >
                <FaFont />
              </Box>
            }
            variant="ghost"
            justifyContent="flex-start"
            fontWeight="normal"
            fontSize="sm"
          >
            <Text>Texto</Text>
          </Button>

          <Button
            leftIcon={
              <Box
                bgColor="gray.100"
                borderRadius="md"
                px="1.5"
                fontSize="xs"
                py="1.5"
              >
                <FaImage />
              </Box>
            }
            variant="ghost"
            justifyContent="flex-start"
            fontWeight="normal"
            fontSize="sm"
          >
            <Text>Imagem</Text>
          </Button>

          <Button
            leftIcon={
              <Box
                bgColor="gray.100"
                borderRadius="md"
                px="1.5"
                fontSize="xs"
                py="1.5"
              >
                <FaVideo />
              </Box>
            }
            variant="ghost"
            justifyContent="flex-start"
            fontWeight="normal"
            fontSize="sm"
          >
            <Text>Video</Text>
          </Button>

          <Button
            leftIcon={
              <Box
                bgColor="gray.100"
                borderRadius="md"
                px="1.5"
                fontSize="xs"
                py="1.5"
              >
                <FaVolumeLow />
              </Box>
            }
            variant="ghost"
            justifyContent="flex-start"
            fontWeight="normal"
            fontSize="sm"
          >
            <Text>Audio</Text>
          </Button>
        </VStack>
      </Grid>
    </>
  );
};

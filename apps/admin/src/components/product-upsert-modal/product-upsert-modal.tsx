import {
  CreateProductClientSchema,
  Product,
  UpdateProductClientSchema,
} from "@shared/models/product-model";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  UseDisclosureReturn,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ImageUpload } from "../image-upload/image-upload";
import { FaTrash } from "react-icons/fa";
import { DeleteProductMutation } from "@/mutations/delete-product-mutation";
import { GetProductsQuery } from "@/queries/get-products-query";
import { useQueryClient } from "@tanstack/react-query";

export type ProductUpsertModalProps = (
  | {
      type: "create";
      onSubmit: (values: z.infer<typeof CreateProductClientSchema>) => void;
    }
  | {
      type: "update";
      product: Product;
      onSubmit: (values: Partial<Product>) => void;
    }
) & {
  disclosure: UseDisclosureReturn;
  isLoading?: boolean;
};

export const ProductUpsertModal = ({
  disclosure,
  isLoading,
  ...props
}: ProductUpsertModalProps) => {
  const { appId } = useRouter().query;
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { isValid },
    watch,
    setValue,
  } = useForm<
    z.infer<
      typeof props extends { type: "update" }
        ? typeof UpdateProductClientSchema
        : typeof CreateProductClientSchema
    >
  >({
    defaultValues:
      props.type === "update"
        ? { ...props.product, app: props.product.app }
        : {
            app: appId?.toString(),
          },
    resolver: zodResolver(CreateProductClientSchema),
  });

  const { isOpen, onClose } = disclosure;

  const deleteProductMutation = DeleteProductMutation.useMutation({
    onSuccess: () => {
      if (props.type === "update") {
        onClose();
        GetProductsQuery.invalidate(queryClient, { appId: props.product.app });
      }
    },
  });

  const submit = useCallback(
    (
      formValues: z.infer<
        typeof props extends { type: "update" }
          ? typeof UpdateProductClientSchema
          : typeof CreateProductClientSchema
      >,
    ) => {
      props.onSubmit(formValues);
    },
    [],
  );

  const handleDelete = useCallback(() => {
    if (props.type === "update") {
      deleteProductMutation.mutate({ productId: props.product._id });
    }
  }, []);

  register("coverUrl");
  const [coverUrl] = watch(["coverUrl"]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(submit)}>
          <ModalHeader>Produto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Nome</FormLabel>
                <Input {...register("name")} type="text" />
              </FormControl>

              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea {...register("description")} resize="none" />
              </FormControl>

              <FormControl>
                <FormLabel>Identificação do produto</FormLabel>
                <Input type="text" {...register("externalProductId")} />
                <FormHelperText>
                  Veja como encontrar a identificação
                </FormHelperText>
              </FormControl>

              <Box w="full">
                {coverUrl ? (
                  <Box position="relative">
                    <HStack
                      inset="0"
                      w="full"
                      justifyContent="flex-end"
                      mb={-10}
                    >
                      <IconButton
                        variant="solid"
                        colorScheme="slate"
                        icon={<FaTrash />}
                        aria-label="Remover imagem de capa"
                        onClick={() => {
                          setValue("coverUrl", undefined);
                        }}
                      />
                    </HStack>
                    <Image borderRadius="lg" src={coverUrl} />
                  </Box>
                ) : (
                  <ImageUpload
                    aspectRatio={210 / 297}
                    onSuccess={async ({ objectUrl }) => {
                      setValue("coverUrl", objectUrl);
                    }}
                    isLoading={isLoading}
                  />
                )}
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="ghost"
              colorScheme="red"
              mr={3}
              onClick={handleDelete}
            >
              Deletar
            </Button>

            <Button type="button" variant="ghost" mr={3} onClick={onClose}>
              Fechar
            </Button>
            <Button
              type="submit"
              variant="solidDark"
              isLoading={isLoading}
              isDisabled={!isValid}
            >
              Salvar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

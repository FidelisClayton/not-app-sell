import { Page } from "@shared/models";
import {
  CreatePageClientSchema,
  UpdatePageClientSchema,
} from "@shared/validation/page-validation";
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
  UseDisclosureReturn,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { z } from "zod";
import { ImageUpload } from "../image-upload/image-upload";

export type PageUpsertModalProps = (
  | {
      type: "update";
      page: Page;
      onSubmit: (values: Page) => void;
    }
  | {
      type: "create";
      onSubmit: (values: z.infer<typeof CreatePageClientSchema>) => void;
    }
) & {
  disclosure: UseDisclosureReturn;
  index: number;
  isLoading?: boolean;
};

export const PageUpsertModal = ({
  disclosure,
  index,
  isLoading,
  ...props
}: PageUpsertModalProps) => {
  const { productId } = useRouter().query;
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<
    z.infer<
      typeof props extends { type: "create" }
        ? typeof CreatePageClientSchema
        : typeof UpdatePageClientSchema
    >
  >({
    defaultValues:
      props.type === "update"
        ? props.page
        : {
            product: productId?.toString(),
            content: "",
            index,
            coverUrl: null,
          },
    resolver: zodResolver(
      props.type === "update" ? UpdatePageClientSchema : CreatePageClientSchema,
    ),
    mode: "all",
  });

  const { isOpen, onClose } = disclosure;

  const submit = useCallback(
    (
      formValues: z.infer<
        typeof props extends { type: "create" }
          ? typeof CreatePageClientSchema
          : typeof UpdatePageClientSchema
      >,
    ) => {
      if (props.type === "create") {
        props.onSubmit(formValues as z.infer<typeof CreatePageClientSchema>);
      } else {
        props.onSubmit(formValues as Page);
      }
    },
    [],
  );

  const coverUrl = watch("coverUrl");
  register("coverUrl");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(submit)}>
          <ModalHeader>Produto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={Boolean(errors.name?.message)}>
                <FormLabel>Nome</FormLabel>
                <Input {...register("name")} type="text" />
                {errors.name?.message && (
                  <FormHelperText fontSize="sm" color="red.500">
                    {errors.name.message}
                  </FormHelperText>
                )}
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
                    aspectRatio={4 / 3}
                    onSuccess={async ({ objectUrl }) => {
                      setValue("coverUrl", objectUrl, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    }}
                    isLoading={isLoading}
                  />
                )}
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="ghost" mr={3} onClick={onClose}>
              Fechar
            </Button>
            <Button
              type="submit"
              variant="solidDark"
              isDisabled={!isValid}
              isLoading={isLoading}
            >
              Salvar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

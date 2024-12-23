import { GetPagesQuery } from "@/queries/get-pages-query";
import { CreatePageClientSchema } from "@/validation/page-validation";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
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
import { z } from "zod";

export type PageUpsertModalProps = {
  disclosure: UseDisclosureReturn;
  onSubmit: (values: z.infer<typeof CreatePageClientSchema>) => void;
  index: number;
};

export const PageUpsertModal = ({
  disclosure,
  onSubmit,
  index,
}: PageUpsertModalProps) => {
  const { productId } = useRouter().query;
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof CreatePageClientSchema>>({
    defaultValues: {
      product: productId?.toString(),
      content: "",
      index,
    },
    resolver: zodResolver(CreatePageClientSchema),
  });

  const { isOpen, onClose } = disclosure;

  const submit = useCallback(
    (formValues: z.infer<typeof CreatePageClientSchema>) => {
      onSubmit(formValues);
    },
    [],
  );

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

              <FormControl>
                <FormLabel>Imagem de Capa</FormLabel>
                <Input {...register("coverUrl")} type="url" />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="ghost" mr={3} onClick={onClose}>
              Fechar
            </Button>
            <Button type="submit" variant="solidDark" isDisabled={!isValid}>
              Salvar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

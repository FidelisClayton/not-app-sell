import { CreateProductClientSchema } from "@/models/product-model";
import {
  Button,
  FormControl,
  FormLabel,
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

export type ProductUpsertModalProps = {
  disclosure: UseDisclosureReturn;
  onSubmit: (values: z.infer<typeof CreateProductClientSchema>) => void;
};

export const ProductUpsertModal = ({
  disclosure,
  onSubmit,
}: ProductUpsertModalProps) => {
  const { appId } = useRouter().query;
  console.log({ appId });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof CreateProductClientSchema>>({
    defaultValues: {
      app: appId?.toString(),
    },
    resolver: zodResolver(CreateProductClientSchema),
  });

  console.log(errors);
  const { isOpen, onClose } = disclosure;

  const submit = useCallback(
    (formValues: z.infer<typeof CreateProductClientSchema>) => {
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
              <FormControl>
                <FormLabel>Nome</FormLabel>
                <Input {...register("name")} type="text" />
              </FormControl>

              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea {...register("description")} resize="none" />
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
            <Button type="submit" variant="solidDark">
              Salvar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

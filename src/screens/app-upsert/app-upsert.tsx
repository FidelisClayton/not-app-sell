import { AppLoginPreview } from "@/components/app-login-preview";
import { AppPreviewWrapper } from "@/components/app-preview-wrapper";
import { CreateAppSchema } from "@/validation/app-validation";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  HStack,
  IconButton,
  Input,
  Select,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import { z } from "zod";

export type AppUpsertProps = {
  onSubmit: (formValues: z.infer<typeof CreateAppSchema>) => void;
  initialValues?: z.infer<typeof CreateAppSchema>;
  isLoading?: boolean;
};

export const AppUpsert = ({
  onSubmit,
  initialValues,
  isLoading,
}: AppUpsertProps) => {
  const router = useRouter();
  const { appId } = router.query;
  const isEditing = typeof appId === "string";

  const {
    register,
    watch,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<z.infer<typeof CreateAppSchema>>({
    defaultValues: initialValues ?? {
      description: null, // Matches schema's nullable
      colorScheme: "red",
      language: null,
      name: "",
      logoUrl: null,
      supportEmail: null,
    },
    resolver: zodResolver(CreateAppSchema),
    reValidateMode: "onChange",
    mode: "onChange",
  });
  const formValues = watch();

  const submit = useCallback(
    (formValues: z.infer<typeof CreateAppSchema>) => {
      onSubmit(formValues);
    },
    [formValues],
  );

  return (
    <form onSubmit={handleSubmit(submit)}>
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

        <Box fontWeight="semibold">
          {isEditing ? (
            <HStack>
              <Button as={Link} href={`/apps/${appId}`}>
                Design
              </Button>
              <Button
                as={Link}
                href={`/apps/${appId}/products`}
                variant="ghost"
              >
                Produtos
              </Button>
            </HStack>
          ) : (
            "Criar novo app"
          )}
        </Box>

        <Button
          type="submit"
          isDisabled={!isValid}
          isLoading={isLoading}
          loadingText="Criando"
          variant="solidDark"
        >
          {isEditing ? "Salvar" : "Criar"}
        </Button>
      </HStack>

      <Grid
        gridTemplateColumns="300px 1fr"
        gap={10}
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
        >
          <FormControl isInvalid={Boolean(errors.name?.message)}>
            <FormLabel size="sm">Nome</FormLabel>
            <Input {...register("name")} />
            {errors.name?.message && (
              <FormHelperText color="red.500">
                {errors.name?.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl>
            <FormLabel size="sm">Descrição</FormLabel>
            <Textarea {...register("description")} resize="none" />
          </FormControl>

          <FormControl>
            <FormLabel size="sm">URL da logo</FormLabel>
            <Input {...register("logoUrl")} />
          </FormControl>

          <FormControl>
            <FormLabel size="sm">Esquema de cores</FormLabel>
            <Select {...register("colorScheme")}>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel {...register("supportEmail")} size="sm">
              Email de suporte
            </FormLabel>
            <Input type="email" />
          </FormControl>
        </VStack>

        <HStack w="full">
          <AppPreviewWrapper>
            <AppLoginPreview app={formValues} />
          </AppPreviewWrapper>
        </HStack>
      </Grid>
    </form>
  );
};

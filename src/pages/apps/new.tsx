import { CreateAppSchema } from "@/validation/app-validation";
import { useToast } from "@chakra-ui/react";
import Head from "next/head";
import { useCallback } from "react";
import { z } from "zod";
import { CreateAppMutation } from "@/mutations/create-app-mutation";
import { useRouter } from "next/router";
import { AppUpsert } from "@/screens/app-upsert";

export default function NewAppPage() {
  const toast = useToast();
  const router = useRouter();
  const createAppMutation = CreateAppMutation.useMutation({
    onSuccess: (data) => {
      toast({
        status: "success",
        description: `O aplicativo ${data.name} foi criado com sucesso!`,
      });
      router.push(`/apps/${data._id}`);
    },
    onError: () => {
      toast({
        status: "error",
        description:
          "Não foi possível criar o aplicativo. tente novamente mais tarde.",
      });
    },
  });

  const handleSubmit = useCallback(
    (formValues: z.infer<typeof CreateAppSchema>) => {
      createAppMutation.mutate(formValues);
    },
    [],
  );

  return (
    <>
      <Head>
        <title>Criar novo app</title>
      </Head>

      <AppUpsert
        onSubmit={handleSubmit}
        isLoading={createAppMutation.isPending}
      />
    </>
  );
}

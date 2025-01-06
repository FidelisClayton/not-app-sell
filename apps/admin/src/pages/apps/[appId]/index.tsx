import { CreateAppSchema } from "@shared/validation/app-validation";
import { useToast } from "@chakra-ui/react";
import Head from "next/head";
import { useCallback } from "react";
import { z } from "zod";
import { useRouter } from "next/router";
import { AppUpsert } from "@/screens/app-upsert";
import { UpdateAppMutation } from "@/mutations/update-app-mutation";
import { GetAppQuery } from "@/queries/get-app-query";

export default function EditAppPage() {
  const { appId } = useRouter().query;
  const toast = useToast();
  const appQuery = GetAppQuery.useQuery({ id: appId?.toString() });
  const createAppMutation = UpdateAppMutation.useMutation({
    onSuccess: (data) => {
      toast({
        status: "success",
        description: `O aplicativo ${data.name} foi atualizado com sucesso!`,
      });
    },
    onError: () => {
      toast({
        status: "error",
        description:
          "Não foi possível atualizar o aplicativo. tente novamente mais tarde.",
      });
    },
  });

  const handleSubmit = useCallback(
    (formValues: z.infer<typeof CreateAppSchema>) => {
      if (!appId) throw new Error("`appId` is missing");
      createAppMutation.mutate({ id: appId.toString(), ...formValues });
    },
    [appId],
  );

  return (
    <>
      <Head>
        <title>{appQuery.data?.name} | Sofistapps</title>
      </Head>

      {appQuery.data && (
        <AppUpsert
          onSubmit={handleSubmit}
          isLoading={createAppMutation.isPending}
          initialValues={appQuery.data}
        />
      )}
    </>
  );
}

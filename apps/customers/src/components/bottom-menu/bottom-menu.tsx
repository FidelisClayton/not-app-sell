import { GetAppQuery } from "@/queries/get-app-query";
import { Button, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiBookOpen, FiCompass, FiUser } from "react-icons/fi";

export const BottomMenu = () => {
  const router = useRouter();
  const appId = router.query.appId as string;
  const appQuery = GetAppQuery.useQuery({ id: appId });

  return (
    <HStack
      bgColor="white"
      borderTopStyle="solid"
      borderTopWidth="1px"
      borderTopColor="gray.100"
      justifyContent="center"
      spacing={4}
    >
      <Button
        h="full"
        variant="ghost"
        flexDirection="column"
        leftIcon={<FiBookOpen />}
        colorScheme={appQuery.data?.colorScheme ?? "slate"}
        justifyContent="center"
        alignItems="center"
        iconSpacing={0}
        gap={1}
        fontSize="xl"
      ></Button>

      <Button
        h="full"
        variant="ghost"
        flexDirection="column"
        leftIcon={<FiCompass />}
        colorScheme={"slate"}
        fontSize="xl"
        justifyContent="center"
        alignItems="center"
        iconSpacing={0}
        gap={1}
      ></Button>

      <Button
        h="full"
        variant="ghost"
        flexDirection="column"
        leftIcon={<FiUser />}
        colorScheme={"slate"}
        fontSize="xl"
        justifyContent="center"
        alignItems="center"
        iconSpacing={0}
        gap={1}
      ></Button>
    </HStack>
  );
};

import { colorsTheme } from "@shared/lib/theme";
import { CreateAppSchema } from "@shared/validation/app-validation";
import {
  Button,
  ChakraProvider,
  Container,
  extendTheme,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Link,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { z } from "zod";

type AppLoginPreviewProps = {
  app: z.infer<typeof CreateAppSchema>;
};

export const AppLoginPreview = ({
  app,
}: PropsWithChildren<AppLoginPreviewProps>) => {
  return (
    <ChakraProvider
      theme={extendTheme(colorsTheme, {
        components: {
          Input: {
            defaultProps: {
              colorScheme: app.colorScheme,
            },
          },
          Button: {
            defaultProps: {
              colorScheme: app.colorScheme,
            },
          },
          Link: {
            defaultProps: {
              colorScheme: app.colorScheme,
            },
          },
        },
      })}
    >
      <Container maxW="md" h="full" w="full" py={{ base: "12", md: "24" }}>
        <Stack gap="8" alignItems="center" justifyContent="center" w="full">
          {app.logoUrl && <Image src={app.logoUrl} maxW="60px" />}
          <Stack w="full" gap={0} textAlign="center">
            <Heading size="lg">{app.name || "Headline"}</Heading>
            <Text color="gray.700">{app.description || "Subheadline"}</Text>
          </Stack>

          <Stack w="full" gap="6">
            <Stack gap="5">
              <FormControl>
                <FormLabel>E-mail</FormLabel>
                <Input type="email" />
              </FormControl>
              <FormControl>
                <FormLabel>Senha</FormLabel>
                <Input type="password" />
              </FormControl>
            </Stack>

            <HStack justify="space-between">
              <Spacer />
              <Button as={Link} variant="link" size="sm">
                Esqueci minha senha
              </Button>
            </HStack>
            <Stack gap="4">
              <Button>Entrar</Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </ChakraProvider>
  );
};

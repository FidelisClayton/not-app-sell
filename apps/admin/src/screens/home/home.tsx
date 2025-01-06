import {
  AspectRatio,
  Container,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";

export const HomeScreen = () => {
  return (
    <Container maxW="2xl" py="20" mx="auto">
      <VStack w="full" alignItems="flex-start" spacing={4}>
        <Text fontSize="3xl">Aplicativos</Text>

        <SimpleGrid w="full" gap={4} columns={4}>
          <AppCard />
          <AppCard />
          <AppCard />
          <AppCard />
          <AppCard />
          <AppCard />
          <NewAppCard />
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

const AppCard = () => {
  return (
    <VStack
      w="full"
      borderWidth="1px"
      borderColor="gray.100"
      borderStyle="solid"
      px="4"
      py="2"
      cursor="pointer"
    >
      <AspectRatio w="full" ratio={1 / 1}>
        <Image
          alt="app"
          src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F2cc81edac92ac56df74e81c7acc75c76.cdn.bubble.io%2Ff1731300565671x935449357031874000%2FSua%2520logo%25201x1.png?w=128&h=128&auto=compress&dpr=2&fit=max"
        />
      </AspectRatio>
      <Text>App 1</Text>
    </VStack>
  );
};

const NewAppCard = () => {
  return (
    <VStack
      w="full"
      borderWidth="1px"
      borderColor="gray.100"
      borderStyle="solid"
      px="4"
      py="2"
      cursor="pointer"
      alignItems="center"
      justifyContent="center"
    >
      <Text>Criar app</Text>
    </VStack>
  );
};

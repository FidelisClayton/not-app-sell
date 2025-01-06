import {
  Container,
  FormControl,
  FormLabel,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

export const AppLoginScreen = () => {
  return (
    <Container maxW="xl" px="4" mx="auto">
      <VStack w="full">
        <Text>Nome do App</Text>
        <Image src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F2cc81edac92ac56df74e81c7acc75c76.cdn.bubble.io%2Ff1731300565671x935449357031874000%2FSua%2520logo%25201x1.png?w=128&h=128&auto=compress&dpr=2&fit=max" />

        <VStack
          w="full"
          borderWidth="1px"
          borderStyle="solid"
          borderColor="gray.100"
          borderRadius="md"
        >
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" />
          </FormControl>

          <FormControl>
            <FormLabel>Senha</FormLabel>
            <Input />
          </FormControl>
        </VStack>
      </VStack>
    </Container>
  );
};

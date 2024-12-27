import { CreateUploadUrlMutation } from "@/mutations/create-upload-url-mutation";
import { UploadFileMutation } from "@/mutations/upload-file-mutation";
import {
  AspectRatio,
  Center,
  Input,
  Spinner,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChangeEvent, useRef } from "react";
import { BSON } from "bson";
import { useSession } from "next-auth/react";

export type ImageUploadProps = {
  onSuccess?: (data: {
    objectUrl: string;
    uploadUrl: string;
    file: File;
  }) => void;
  isLoading?: boolean;
  aspectRatio?: number;
  containerProps?: Partial<StackProps>;
};

export const ImageUpload = ({
  onSuccess,
  isLoading: isLoadingExternal,
  aspectRatio,
  containerProps,
}: ImageUploadProps) => {
  const session = useSession();
  const inputRef = useRef<HTMLInputElement>(null);

  const createUploadUrlMutation = CreateUploadUrlMutation.useMutation({});
  const uploadFileMutation = UploadFileMutation.useMutation({});

  const uploadFile = async (file: File) => {
    if (!file) {
      return alert("Please select a file");
    }

    const fileId = new BSON.ObjectId().toHexString();
    const basePath = session.data?.user?.email
      ? // TODO: replace email with ID
        `${session.data.user.email}/`
      : "";

    try {
      const { uploadUrl } = await createUploadUrlMutation.mutateAsync({
        fileName: `${basePath}${fileId}_${file.name}`,
        fileType: file.type,
      });

      const objectUrl = uploadUrl.split("?")[0];

      await uploadFileMutation.mutateAsync({
        file,
        uploadUrl,
      });

      onSuccess?.({
        objectUrl,
        uploadUrl,
        file,
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("File upload failed");
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    uploadFile(file);
  };

  const isLoading =
    isLoadingExternal ||
    createUploadUrlMutation.isPending ||
    uploadFileMutation.isPending;

  return (
    <AspectRatio w="full" ratio={aspectRatio ?? 16 / 9}>
      <VStack
        w="full"
        alignItems="center"
        justifyContent="center"
        spacing={0}
        bgColor="slate.100"
        borderRadius="lg"
        cursor="pointer"
        {...containerProps}
        onClick={handleClick}
      >
        <Text textAlign="center" w="full">
          Arraste sua imagem aqui
        </Text>
        <Text textAlign="center" fontSize="sm" w="full">
          ou clique para fazer upload
        </Text>

        {isLoading && (
          <Center
            top="0"
            left="0"
            position="absolute"
            w="full"
            h="full"
            bgColor="blackAlpha.500"
          >
            <VStack>
              <Spinner colorScheme="whiteAlpha" />
              <Text fontSize="sm" color="whiteAlpha.800">
                Fazendo upload da imagem
              </Text>
            </VStack>
          </Center>
        )}

        <Input
          ref={inputRef}
          onChange={handleChange}
          type="file"
          position="absolute"
          display="none"
        />
      </VStack>
    </AspectRatio>
  );
};

import { Alert, AlertDescription, Box, Input } from "@chakra-ui/react";
import { NodeViewProps } from "@tiptap/core";
import { NodeViewWrapper } from "@tiptap/react";
import { ChangeEvent, FocusEvent, useState } from "react";

export const AlertNode = (props: NodeViewProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <NodeViewWrapper className="alert">
      {file ? file.name : <Input onChange={handleChange} type="file" />}
    </NodeViewWrapper>
  );
};

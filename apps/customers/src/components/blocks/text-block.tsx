import { TextBlock as TTextBlock } from "@shared/models/block-model";
import { Box } from "@chakra-ui/react";

export type TextBlockProps = {
  block: TTextBlock;
};

export const TextBlock = ({ block }: TextBlockProps) => {
  if (typeof window === "undefined") return null;

  return (
    <Box
      w="full"
      sx={{
        ".tiptap p.is-editor-empty:first-child::before": {
          color: "#adb5bd",
          content: "attr(data-placeholder)",
          float: "left",
          height: "0",
          pointerEvents: "none",
        },
        ".ProseMirror-focused": {
          outline: "none",
        },
        ".tiptap": {
          h1: {
            fontSize: "3xl",
            mt: 4,
          },
          h2: {
            fontSize: "2xl",
            mt: 4,
          },
          h3: {
            fontSize: "xl",
            mt: 4,
          },
          h4: {
            fontSize: "lg",
            mt: 4,
          },
          "> p": {
            py: 2,
          },
          "ol, ul": {
            paddingLeft: 4,
          },
          li: {
            mb: 1,
          },
        },
      }}
    >
      <Box
        className="tiptap"
        dangerouslySetInnerHTML={{ __html: block.content }}
      />
    </Box>
  );
};

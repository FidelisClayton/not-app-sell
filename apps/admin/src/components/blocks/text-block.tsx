import { TextBlock as TTextBlock } from "@shared/models/block-model";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BubbleMenu } from "../page-editor/components/floating-menu";
import { Box } from "@chakra-ui/react";
import Placeholder from "@tiptap/extension-placeholder";
import { UpdateBlockMutation } from "@/mutations/update-block-mutation";
import { useDebouncedCallback } from "use-debounce";
import { BlockWrapper } from "../block-wrapper";

export type TextBlockProps = {
  block: TTextBlock;
};

const extensions = [
  StarterKit.configure({
    gapcursor: false,
    dropcursor: false,
  }),
  Placeholder.configure({
    placeholder: "Digite algo aqui...",
  }),
];

export const TextBlock = ({ block }: TextBlockProps) => {
  const updateBlockMutation = UpdateBlockMutation.useMutation({});

  const handleChange = useDebouncedCallback(
    ({ editor }: { editor: Editor }) => {
      updateBlockMutation.mutate({
        blockId: block._id,
        type: block.type,
        content: editor.getHTML(),
        page: block.page,
      } as Partial<TTextBlock>);
    },
    500,
  );

  const editor = useEditor({
    extensions: extensions,
    content: block.content,
    onUpdate: handleChange,
    immediatelyRender: false,
  });

  if (typeof window === "undefined") return null;

  if (!editor) return null;

  return (
    <BlockWrapper block={block}>
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
        <EditorContent editor={editor} />
        <BubbleMenu editor={editor} />
      </Box>
    </BlockWrapper>
  );
};

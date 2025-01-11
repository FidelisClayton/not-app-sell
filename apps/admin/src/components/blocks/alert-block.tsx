import { AlertBlock as TAlertBlock } from "@shared/models/block-model";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BubbleMenu } from "../page-editor/components/floating-menu";
import {
  Alert,
  AlertProps,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import Placeholder from "@tiptap/extension-placeholder";
import { UpdateBlockMutation } from "@/mutations/update-block-mutation";
import { useDebouncedCallback } from "use-debounce";
import { BlockWrapper } from "../block-wrapper";
import { match } from "ts-pattern";
import { FiChevronDown } from "react-icons/fi";
import { useCallback } from "react";
import { GetBlocksQuery } from "@/queries/get-blocks-query";
import { useQueryClient } from "@tanstack/react-query";

export type AlertBlockProps = {
  block: TAlertBlock;
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

export const AlertBlock = ({ block }: AlertBlockProps) => {
  const queryClient = useQueryClient();
  const updateBlockMutation = UpdateBlockMutation.useMutation({});

  const handleChange = useDebouncedCallback(
    ({ editor }: { editor: Editor }) => {
      updateBlockMutation.mutate({
        blockId: block._id,
        type: block.type,
        content: editor.getHTML(),
        page: block.page,
        status: block.status,
      } as Partial<TAlertBlock>);
    },
    500,
  );

  const updateStatus = useCallback(
    (status: TAlertBlock["status"]) => {
      updateBlockMutation.mutate(
        {
          blockId: block._id,
          type: block.type,
          content: block.content,
          page: block.page,
          status: status,
        } as Partial<TAlertBlock>,
        {
          onSuccess: () => {
            GetBlocksQuery.invalidate(queryClient, { pageId: block.page });
          },
        },
      );
    },
    [updateBlockMutation],
  );

  const status = match<TAlertBlock["status"], AlertProps["status"]>(
    block.status,
  )
    .with("Alert", () => "warning")
    .with("Info", () => "info")
    .with("Error", () => "error")
    .with("Success", () => "success")
    .with("Neutral", () => undefined)
    .otherwise(() => undefined);

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
      <Alert
        status={status}
        overflow="visible"
        position="relative"
        className="group"
        borderRadius="lg"
      >
        <Menu>
          <MenuButton
            opacity={0}
            _groupHover={{ opacity: 1 }}
            as={Button}
            size="xs"
            variant="ghost"
            h="3"
            position="absolute"
            right="0"
            top="0"
            iconSpacing="0"
            rightIcon={
              <Box>
                <FiChevronDown />
              </Box>
            }
          >
            {block.status}
          </MenuButton>

          <MenuList>
            <MenuItem onClick={() => updateStatus("Success")}>Sucesso</MenuItem>
            <MenuItem onClick={() => updateStatus("Info")}>Info</MenuItem>
            <MenuItem onClick={() => updateStatus("Alert")}>Atenção</MenuItem>
            <MenuItem onClick={() => updateStatus("Error")}>Perigoso</MenuItem>
          </MenuList>
        </Menu>
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
      </Alert>
    </BlockWrapper>
  );
};

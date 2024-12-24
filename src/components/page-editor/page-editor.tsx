"use client";

import { Box, Button, Container, Heading, VStack } from "@chakra-ui/react";
import {
  Editor,
  EditorContent,
  FloatingMenu as TiptapFloatingMenu,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
// import { FloatingMenu } from "./components/floating-menu/floating-menu";
import Image from "@tiptap/extension-image";
import { SnippetExtension } from "@/lib/tiptap";
import Paragraph from "@tiptap/extension-paragraph";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import DragHandle from "@tiptap-pro/extension-drag-handle-react";
import { BubbleMenu } from "./components/floating-menu/floating-menu";
import { PageDocument } from "@/models";
import { Ref, RefObject } from "react";
import AlertNode from "../alert-node";
import { ChakraAlertExtension } from "../alert-node/alert-2";

const extensions = [
  StarterKit.configure({
    gapcursor: false,
  }),
  Paragraph,
  Image,
  SnippetExtension,
  GlobalDragHandle,
  AlertNode,
  ChakraAlertExtension,
];

const MENU_ITEMS = [
  {
    label: "Parágrafo",
    isActive: (editor: Editor) => editor.isActive("paragraph"),
    apply: (editor: Editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    label: "Título 1",
    isActive: (editor: Editor) => editor.isActive("heading", { level: 1 }),
    apply: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    label: "Título 2",
    isActive: (editor: Editor) => editor.isActive("heading", { level: 2 }),
    apply: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: "Título 3",
    isActive: (editor: Editor) => editor.isActive("heading", { level: 3 }),
    apply: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    label: "Título 4",
    isActive: (editor: Editor) => editor.isActive("heading", { level: 4 }),
    apply: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 4 }).run(),
  },
  {
    label: "Lista",
    isActive: (editor: Editor) => editor.isActive("bulletList"),
    apply: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    label: "Lista ordenada",
    isActive: (editor: Editor) => editor.isActive("orderedList"),
    apply: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(),
  },
];

export type PageEditorProps = {
  page: PageDocument;
  editorRef: RefObject<Editor | null>;
};

export const PageEditor = ({ page, editorRef }: PageEditorProps) => {
  const editor = useEditor({
    extensions: extensions,
    content: page.content,
    // content: `<alert>Hello</alert>`,
    onUpdate: (editor) => console.log(editor.editor.getHTML()),
    immediatelyRender: false,
  });

  editorRef.current = editor;

  if (!editor) return null;

  return (
    <Container
      maxW="lg"
      minH="60vh"
      bgColor="white"
      borderRadius="md"
      py="4"
      mt={8}
    >
      <button
        onClick={() => {
          // @ts-expect-error
          editor?.commands.insertSuccessCallout();
        }}
      >
        Add
      </button>
      <Box
        sx={{
          ".tiptap.ProseMirror": {
            w: "full",
            "> *": {
              py: 2,
            },
            h1: {
              fontSize: "3xl",
              fontWeight: "semibold",
            },
            h2: {
              fontSize: "2xl",
              fontWeight: "semibold",
            },
            h3: {
              fontSize: "xl",
              fontWeight: "semibold",
            },
            h4: {
              fontSize: "lg",
              fontWeight: "semibold",
            },
          },
          ".ProseMirror-focused": {
            outline: "none",
          },
          ".prosemirror-dropcursor-inline": {
            bgColor: "red",
            display: "block",
            color: "red",
          },
        }}
        p={8}
        bgColor="white"
        h="full"
        w="full"
      >
        <DragHandle editor={editor}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 9h16.5m-16.5 6.75h16.5"
            />
          </svg>
        </DragHandle>
        <EditorContent editor={editor} />
        <BubbleMenu editor={editor} />
        <TiptapFloatingMenu
          editor={editor}
          shouldShow={({ state }) => {
            const { $from } = state.selection;
            const currentLineText = $from.nodeBefore?.textContent;

            return currentLineText === "/";
          }}
        >
          <VStack bgColor="white" boxShadow="md">
            {MENU_ITEMS.map((item) => (
              <Button
                key={item.label}
                borderRadius="0"
                variant="ghost"
                justifyContent="flex-start"
                fontWeight="normal"
                w="full"
                onClick={() => {
                  item.apply(editor);
                }}
              >
                {item.label}
              </Button>
            ))}
          </VStack>
        </TiptapFloatingMenu>
      </Box>
    </Container>
  );
};

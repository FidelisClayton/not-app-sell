import { IconButton, Wrap } from "@chakra-ui/react";
import { BubbleMenu as TiptapBubbleMenu, Editor } from "@tiptap/react";
import { FaBold, FaItalic, FaStrikethrough } from "react-icons/fa";
import { FormatsMenu } from "./formats-menu";

type FloatingMenuProps = {
  editor: Editor;
};

export const BubbleMenu = ({ editor }: FloatingMenuProps) => {
  return (
    <TiptapBubbleMenu
      editor={editor}
      shouldShow={({ state }) => {
        const { from, to } = state.selection;
        return from !== to; // Show only when text is selected
      }}
    >
      <Wrap
        bgColor="white"
        boxShadow="md"
        p={0.5}
        borderRadius="md"
        spacing={0.5}
      >
        <FormatsMenu editor={editor} />

        <IconButton
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
          icon={<FaBold />}
          aria-label="Negrito"
          colorScheme={editor.isActive("bold") ? "purple" : undefined}
          size="sm"
        />
        <IconButton
          variant="ghost"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          icon={<FaItalic />}
          aria-label="Italico"
          colorScheme={editor.isActive("italic") ? "purple" : undefined}
          size="sm"
        />
        <IconButton
          variant="ghost"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          colorScheme={editor.isActive("strike") ? "purple" : undefined}
          icon={<FaStrikethrough />}
          size="sm"
          aria-label="Strikethrough"
        />
      </Wrap>
    </TiptapBubbleMenu>
  );
};

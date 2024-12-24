import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Editor } from "@tiptap/core";
import { useMemo } from "react";
import { FaChevronDown } from "react-icons/fa";
import { match } from "ts-pattern";

export type FormatsMenuProps = {
  editor: Editor;
};

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

export const FormatsMenu = ({ editor }: FormatsMenuProps) => {
  const activeFormat = useMemo(() => {
    return match(editor)
      .when(
        (editor) => editor.isActive("heading", { level: 1 }),
        () => "Título 1",
      )
      .when(
        (editor) => editor.isActive("heading", { level: 2 }),
        () => "Título 2",
      )
      .when(
        (editor) => editor.isActive("heading", { level: 3 }),
        () => "Título 3",
      )
      .when(
        (editor) => editor.isActive("heading", { level: 4 }),
        () => "Título 4",
      )
      .when(
        (editor) => editor.isActive("bulletList"),
        () => "Lista",
      )
      .when(
        (editor) => editor.isActive("orderedList"),
        () => "Lista ordenada",
      )
      .otherwise(() => "Parágrafo");
  }, [editor]);

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        aria-label="Formatação"
        size="sm"
        rightIcon={<FaChevronDown />}
      >
        {activeFormat}
      </MenuButton>

      <MenuList>
        {MENU_ITEMS.map((item) => (
          <MenuItem
            onClick={() => item.apply(editor)}
            bgColor={item.isActive(editor) ? "purple.100" : undefined}
          >
            {item.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

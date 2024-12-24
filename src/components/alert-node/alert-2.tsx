import { Node, NodeViewProps } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

const ChakraAlert = ({ node, updateAttributes }: NodeViewProps) => {
  const { status = "info" } = node.attrs;

  return (
    <NodeViewWrapper>
      <Alert status={status}>
        <AlertIcon />
        <div
          contentEditable={false}
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <AlertTitle>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                updateAttributes({ title: e.target.textContent });
              }}
            >
              {node.attrs.title || "Editable Title"}
            </span>
          </AlertTitle>
          <AlertDescription>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                updateAttributes({ description: e.target.textContent });
              }}
            >
              {node.attrs.description || "Editable Description"}
            </span>
          </AlertDescription>
        </div>
      </Alert>
    </NodeViewWrapper>
  );
};

export const ChakraAlertExtension = Node.create({
  name: "chakraAlert",

  group: "block",

  content: "inline*", // Allows inline nodes (text or formatted content) inside the alert

  atom: false, // Make the node editable

  addAttributes() {
    return {
      status: {
        default: "info", // Chakra UI Alert status: 'info', 'warning', 'success', 'error'
      },
      title: {
        default: "",
      },
      description: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "chakra-alert", // Custom tag for parsing (optional)
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["chakra-alert", HTMLAttributes];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChakraAlert);
  },

  // @ts-expect-error
  addCommands() {
    return {
      insertChakraAlert:
        ({
          status,
          title,
          description,
        }: {
          status?: string;
          title?: string;
          description?: string;
        }) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: { status, title, description },
          });
        },
    };
  },
});

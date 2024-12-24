import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { AlertNode as Alert } from "./alert-node";

const AlertNode = Node.create({
  name: "successCallout",
  group: "block",
  content: "inline*",
  atom: true,
  addAttributes() {
    return {
      value: {
        default: "",
      },
    };
  },
  parseHTML() {
    return [{ tag: "success-callout" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["success-callout", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(Alert);
  },
  // @ts-expect-error
  addCommands() {
    return {
      insertSuccessCallout:
        ({ value }: { value?: string } = {}) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: { value },
          });
        },
    };
  },
});

export default AlertNode;

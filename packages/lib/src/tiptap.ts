/* eslint-disable import/no-extraneous-dependencies */
import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import { DOMParser } from "prosemirror-model";

function wrapHtmlInTemplate(value: string): HTMLSpanElement {
  const element = document.createElement("div");
  element.innerHTML = `${value.trim()}`;
  return element;
}

export const SnippetExtension = Extension.create({
  name: "snippet",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDrop(view, event: DragEvent | any): boolean {
            if (!event) return false;

            event.preventDefault();

            const coordinates = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });

            const snippetContent = event.dataTransfer.getData("snippet");

            if (!snippetContent || !coordinates) return false;

            const parsedContent = DOMParser.fromSchema(
              view.state.schema,
            ).parseSlice(wrapHtmlInTemplate(snippetContent));

            // Ensure block-level drop
            const resolvedPos = view.state.doc.resolve(coordinates.pos);

            let insertionPos = coordinates.pos;

            if (!resolvedPos.nodeAfter || !resolvedPos.nodeAfter.isBlock) {
              // Adjust to the end of the current block if dropping in inline content
              const endOfBlock = resolvedPos.end(resolvedPos.depth);
              insertionPos = endOfBlock;
            }

            const dropTransaction = view.state.tr.insert(
              insertionPos,
              parsedContent.content,
            );

            dropTransaction.setMeta("isSnippetDropTransaction", true);

            view.dispatch(dropTransaction);

            return true;
          },
        },
      }),
    ];
  },
});

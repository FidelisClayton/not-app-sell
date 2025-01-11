import { AlertBlock as TAlertBlock } from "@shared/models/block-model";
import { Alert, AlertProps, Box } from "@chakra-ui/react";
import { match } from "ts-pattern";

export type AlertBlockProps = {
  block: TAlertBlock;
};

export const AlertBlock = ({ block }: AlertBlockProps) => {
  const status = match<TAlertBlock["status"], AlertProps["status"]>(
    block.status,
  )
    .with("Alert", () => "warning")
    .with("Info", () => "info")
    .with("Error", () => "error")
    .with("Success", () => "success")
    .with("Neutral", () => undefined)
    .otherwise(() => undefined);

  if (typeof window === "undefined") return null;

  return (
    <Alert
      status={status}
      overflow="visible"
      position="relative"
      className="group"
      borderRadius="lg"
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
    </Alert>
  );
};

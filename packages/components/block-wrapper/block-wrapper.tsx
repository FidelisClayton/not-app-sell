import { Block, BlockType } from "@/models/block-model";
import { DeleteBlockMutation } from "@/mutations/delete-block-mutation";
import { GetBlocksQuery } from "@/queries/get-blocks-query";
import { HStack, IconButton } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, useRef, useState } from "react";
import { FaGripVertical, FaTrash } from "react-icons/fa";
import { DropTargetMonitor, useDrag, useDrop } from "react-dnd";
import { match } from "ts-pattern";
import { CreateBlockMutation } from "@/mutations/create-block-mutation";
import { BSON } from "bson";
import { ReorderBlockMutation } from "@/mutations/reorder-block-mutation";

type BlockWrapperProps = PropsWithChildren<{
  block: Block;
}>;

export const BlockWrapper = ({ block, children }: BlockWrapperProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorLocation, setCursorLocation] = useState<"top" | "bottom" | null>(
    null,
  );
  const queryClient = useQueryClient();
  const invalidateBlocks = () =>
    GetBlocksQuery.invalidate(queryClient, { pageId: block.page });
  const deleteBlockMutation = DeleteBlockMutation.useMutation({
    onSuccess: () => {
      invalidateBlocks();
    },
  });
  const createBlockMutation = CreateBlockMutation.useMutation({
    onSuccess: () => {
      invalidateBlocks();
    },
  });
  const reorderBlockMutation = ReorderBlockMutation.useMutation({
    onSuccess: () => {
      invalidateBlocks();
    },
  });

  const handleDelete = () => {
    deleteBlockMutation.mutate({ blockId: block._id });
  };

  const [collectedProps, drop] = useDrop<
    { blockType: BlockType; settings: Record<string, any> } | Block,
    unknown,
    {
      isOver: boolean;
    }
  >(
    () => ({
      accept: ["NewBlock", "Block"],
      hover: (_, monitor) => {
        if (!containerRef.current) return;

        setCursorLocation(
          getCursorLocation({ monitor, element: containerRef.current }),
        );
      },
      drop: (item, monitor) => {
        if (!containerRef.current) return;

        if (monitor.getItemType() === "NewBlock" && "blockType" in item) {
          const cursorLocation = getCursorLocation({
            monitor,
            element: containerRef.current,
          });

          if (cursorLocation) {
            const index = match({ cursorLocation })
              .with({ cursorLocation: "bottom" }, () => block.index + 1)
              .otherwise(() => block.index);

            if (!block) {
              console.error("`block` is not available.");
              return;
            }

            const _id = new BSON.ObjectId().toString("hex");
            const page = block.page;

            const newBlock = match<
              { blockType: BlockType; settings: Record<string, any> },
              Block | null
            >({ blockType: item.blockType, settings: item.settings })
              .with({ blockType: BlockType.Text }, ({ blockType: type }) => ({
                _id,
                type,
                content: "",
                index,
                page,
              }))
              .with({ blockType: BlockType.Image }, ({ blockType: type }) => ({
                _id,
                type,
                page,
                url: null,
                index,
              }))
              .with({ blockType: BlockType.File }, ({ blockType: type }) => ({
                _id,
                type,
                page,
                url: null,
                index,
                fileName: null,
                fileSize: null,
              }))
              .with(
                {
                  blockType: BlockType.VideoEmbed,
                  settings: { provider: "Youtube" },
                },
                ({ blockType: type }) => ({
                  _id,
                  index,
                  type,
                  page,
                  url: null,
                  provider: "Youtube",
                }),
              )
              .with(
                {
                  blockType: BlockType.VideoEmbed,
                  settings: { provider: "Vimeo" },
                },
                ({ blockType: type }) => ({
                  _id,
                  index,
                  type,
                  page,
                  url: null,
                  provider: "Vimeo",
                }),
              )
              .otherwise(() => null);

            if (!newBlock) {
              console.error(
                `block type of '${item.blockType}' is not supported`,
              );
              return;
            }

            createBlockMutation.mutate({
              ...newBlock,
              pageId: newBlock.page,
            });
          }
        }

        if (monitor.getItemType() === "Block" && "_id" in item) {
          const index = match({ cursorLocation })
            .with({ cursorLocation: "bottom" }, () => block.index + 1)
            .otherwise(() => block.index);

          reorderBlockMutation.mutate({
            blockId: item._id,
            index,
            type: item.type,
          });
        }
      },
      collect: (monitor) => {
        return {
          isOver: monitor.isOver(),
        };
      },
    }),
    [block],
  );

  const [_collected, drag, dragPreview] = useDrag(
    () => ({
      type: "Block",
      item: block,
    }),
    [block],
  );

  return (
    <HStack
      ref={(element) => {
        containerRef.current = element;
        drop(element);
        dragPreview(element);
      }}
      position="relative"
      w="full"
      py="2"
      _hover={{
        ".block__hoverable-button": {
          opacity: 1,
        },
      }}
      _before={
        collectedProps.isOver && cursorLocation === "top"
          ? {
              content: '""',
              h: 0.5,
              bgColor: "slate.800",
              display: "block",
              w: "full",
              position: "absolute",
              top: "0",
              left: "0",
            }
          : undefined
      }
      _after={
        collectedProps.isOver && cursorLocation === "bottom"
          ? {
              content: '""',
              h: 0.5,
              bgColor: "slate.800",
              display: "block",
              w: "full",
              position: "absolute",
              bottom: "0",
              left: "0",
            }
          : undefined
      }
    >
      <IconButton
        className="block__hoverable-button"
        size="xs"
        icon={<FaGripVertical />}
        aria-label="Arrastar bloco"
        opacity={0}
        position="absolute"
        left="-28px"
        cursor="grab"
        ref={(element) => {
          drag(element);
        }}
      />

      {children}

      <IconButton
        className="block__hoverable-button"
        size="xs"
        icon={<FaTrash />}
        onClick={handleDelete}
        aria-label="Delete block"
        opacity={0}
        position="absolute"
        right="-28px"
      />
    </HStack>
  );
};

export type HoverLocation = "top" | "bottom" | null;

export function getCursorLocation<Target>({
  monitor,
  element,
}: {
  monitor: DropTargetMonitor<Target>;
  element: HTMLElement;
}): HoverLocation {
  // Determine rectangle on screen
  const hoverBoundingRect = element.getBoundingClientRect();

  // Get vertical middle
  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

  // Determine mouse position
  const clientOffset = monitor.getClientOffset();
  if (!clientOffset) return null;

  // Get pixels to the top
  const hoverClientY = clientOffset.y - hoverBoundingRect.top;
  return hoverClientY > hoverMiddleY ? "bottom" : "top";
}

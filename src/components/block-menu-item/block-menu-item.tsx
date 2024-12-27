import { BlockType } from "@/models/block-model";
import { Box, Button } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { useDrag } from "react-dnd";

export type BlockMenuItemProps = {
  blockType: BlockType;
  Icon: FunctionComponent;
  label: ReactNode;
  onClick: (blockType: BlockType) => void;
};

export const BlockMenuItem = ({
  blockType,
  Icon,
  label,
  onClick,
}: BlockMenuItemProps) => {
  const [_collected, drag, _dragPreview] = useDrag(() => ({
    type: "NewBlock",
    item: { blockType },
  }));
  return (
    <Button
      ref={(element) => {
        drag(element);
      }}
      variant="ghost"
      w="full"
      justifyContent="flex-start"
      fontWeight="normal"
      borderRadius="none"
      draggable
      onClick={() => onClick(blockType)}
      leftIcon={
        <Box
          p={1.5}
          bgColor="slate.50"
          borderRadius="sm"
          color="gray.500"
          fontSize="sm"
        >
          <Icon />
        </Box>
      }
    >
      {label}
    </Button>
  );
};

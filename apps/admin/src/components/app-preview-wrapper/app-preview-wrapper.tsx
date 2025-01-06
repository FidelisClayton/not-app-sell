import { AspectRatio, Box } from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

export const AppPreviewWrapper = ({ children }: PropsWithChildren) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;

        const contentWidth = contentRef.current.scrollWidth;
        const contentHeight = contentRef.current.scrollHeight;

        // Calculate scale to fit the content inside the container
        const newScale = Math.min(
          containerWidth / contentWidth,
          containerHeight / contentHeight,
        );

        setScale(newScale);
      }
    };

    window.addEventListener("resize", updateScale);
    updateScale(); // Initial calculation

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <Box ref={containerRef} w="full" maxW="400px">
      <AspectRatio w="full" ratio={9 / 16}>
        <Box
          boxShadow="sm"
          ref={contentRef}
          bgColor="white"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.100"
          borderStyle="solid"
          style={{ transform: `scale(${scale})` }}
          transformOrigin="top left"
          w="full"
          h="full"
        >
          {children}
        </Box>
      </AspectRatio>
    </Box>
  );
};

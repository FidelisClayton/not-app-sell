import { VideoEmbedBlockProvider } from "@shared/models";
import { Box } from "@chakra-ui/react";
import { useLayoutEffect, useRef } from "react";

export type VideoPlayerProps = {
  id: string;
  url: string;
  provider: VideoEmbedBlockProvider;
};

export const VideoPlayer = ({ url, provider }: VideoPlayerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;

    const Plyr = require("plyr");
    new Plyr(ref.current);
  }, []);

  return provider === "Vimeo" ? (
    <Box ref={ref} data-plyr-provider="vimeo" data-plyr-embed-id={url} />
  ) : (
    <Box ref={ref} w="full" className="plyr__video-embed">
      <Box
        as="iframe"
        w="full"
        src={url}
        allowFullScreen
        allowTransparency
        allow="autoplay"
      />
    </Box>
  );
};

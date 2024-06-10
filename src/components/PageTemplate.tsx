import { Flex, FlexProps } from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef } from "react";
import { useScrollContext } from "../contexts/ScrollContext";

const PageTemplate = ({
  first,
  odd,
  children,
  onWheelDown,

  ...props
}: {
  first?: boolean;
  odd?: boolean;
  onWheelDown: () => void;
  children: React.ReactNode;
} & FlexProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { goUp, isScrolling } = useScrollContext();

  const onWheel = useCallback(
    (e: WheelEvent) => {
      if (isScrolling.current) return;
      if (e.deltaY > 0) {
        // 올라가는거만 얘가 알아서
        onWheelDown();
      } else {
        goUp();
      }
      e.stopPropagation();
    },
    [onWheelDown]
  );

  useEffect(() => {
    scrollRef.current?.addEventListener("wheel", onWheel);

    return () => {
      scrollRef.current?.removeEventListener("wheel", onWheel);
    };
  }, [onWheelDown]);

  return (
    <Flex
      ref={scrollRef}
      w="100dvw"
      h="100dvh"
      position={"relative"}
      boxSizing="border-box"
      overflow={"hidden"}
      cursor={"default"}
      flexDir={"column"}
      flexShrink={0}
      bgColor={first ? "rgba(162, 215, 197, 1)" : odd ? "#fff5f5" : "#faf4e3"}
      {...props}
    >
      <Flex w="100%" h="100%" flexDir={"column"}>
        {children}
      </Flex>
    </Flex>
  );
};

export default PageTemplate;

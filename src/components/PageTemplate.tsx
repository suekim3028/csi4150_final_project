import { Flex, FlexProps } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
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
  const { goUp } = useScrollContext();

  const onWheel = (e: WheelEvent) => {
    if (e.deltaY > 0) {
      console.log("down!");
      // 올라가는거만 얘가 알아서
      onWheelDown();
    } else {
      goUp();
    }
    e.stopPropagation();
  };

  useEffect(() => {
    scrollRef.current?.addEventListener("wheel", onWheel);

    return () => {
      scrollRef.current?.removeEventListener("wheel", onWheel);
    };
  }, []);

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
      {children}
    </Flex>
  );
};

export default PageTemplate;

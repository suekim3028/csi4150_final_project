import { Flex, FlexProps } from "@chakra-ui/react";
import React from "react";

const Text = ({
  type,
  children,
  ...props
}: {
  type: "SemiBold" | "Bold" | "Regular" | "Medium";
  children: React.ReactNode;
} & FlexProps) => {
  return (
    <Flex
      fontFamily={`Pretendard-${type} !important`}
      whiteSpace={"pre-line"}
      wordBreak={"break-all"}
      {...props}
      color={props["color"] || "black"}
    >
      {children}
    </Flex>
  );
};

export default Text;

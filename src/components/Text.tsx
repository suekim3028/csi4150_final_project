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
    <Flex fontFamily={`Pretendard-${type} !important`} {...props}>
      {children}
    </Flex>
  );
};

export default Text;

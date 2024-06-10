import { Flex } from "@chakra-ui/react";
import React from "react";
import { useScrollContext } from "../contexts/ScrollContext";
import PageTemplate from "./PageTemplate";
import Text from "./Text";
const TitlePage = () => {
  const { goDown } = useScrollContext();
  return (
    <PageTemplate justifyContent={"center"} pl="10%" onWheelDown={goDown} first>
      <Flex flex={1} alignItems={"center"}>
        <Text type={"Bold"} fontSize={55} zIndex={2} color={"#040430"}>
          저출산·고령화로 우리 생활은
          <br />
          어떻게 달라졌을까요?
        </Text>
        <img
          src="https://img.freepik.com/free-vector/hand-drawn-asian-family-illustration_23-2149397193.jpg?t=st=1717857620~exp=1717861220~hmac=c06f7b0f15368fdcd6f893b8f79ef2ac24e81b46369b9cc10432b882edaa342e&w=740"
          width="40%"
          style={{
            position: "absolute",
            right: "0px",
            bottom: "0px",
            zIndex: 0,
          }}
        />
      </Flex>
    </PageTemplate>
  );
};

export default TitlePage;

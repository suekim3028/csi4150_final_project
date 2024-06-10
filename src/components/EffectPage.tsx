import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { COLORS } from "../constants";
import { useScrollContext } from "../contexts/ScrollContext";
import PageTemplate from "./PageTemplate";
import Text from "./Text";

const EffectPage = () => {
  const { goDown, lock } = useScrollContext();

  const [showAnswer, setShowAnswer] = useState(false);

  const onWheel = () => {
    console.log("====");
    lock(3000);
    setShowAnswer(true);
  };

  return (
    <PageTemplate onWheelDown={showAnswer ? goDown : onWheel} odd>
      <Flex w="100%" h="100%" flexDirection={"column"} p={40}>
        <Flex flexDir={"column"} p={30}>
          <Text type="SemiBold" fontSize={42}>
            다음 일상 생활의 변화 중,
          </Text>
          <Text type="SemiBold" fontSize={42}>
            <span style={{ color: COLORS.BLUE }}>저출산 / 고령화</span>와 관련
            있는 것은 무엇일까요?
          </Text>
        </Flex>

        <Flex
          flex={1}
          p={50}
          alignItems={"center"}
          justifyContent={"space-around"}
        >
          <Flex
            // alignItems={"center"}
            justifyContent={"center"}
            flexDir={"column"}
          >
            {questions.map((question, index) => (
              <Flex
                opacity={showAnswer && index == 1 ? 0.2 : 1}
                transition={"1s linear"}
              >
                <Text type={"Medium"} fontSize={40} mr={10} color={COLORS.BLUE}>
                  {index + 1}.
                </Text>
                <Text type={"Medium"} fontSize={40}>
                  {question}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </PageTemplate>
  );
};

const questions = ["1인 가구 수", "과일 가격의 상승", "요양 병원 증가"];

export default EffectPage;

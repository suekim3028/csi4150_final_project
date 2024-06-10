import { Flex } from "@chakra-ui/react";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import React, { useCallback, useRef, useState } from "react";
import { COLORS } from "../constants";
import { useScrollContext } from "../contexts/ScrollContext";
import { useOnRender } from "../hooks/useOnRender";
import PageTemplate from "./PageTemplate";
import Text from "./Text";

const OldTermPage = () => {
  const { goDown, lock, unlock } = useScrollContext();
  const divRef = useRef<HTMLDivElement>(null);

  const [showAnswer, setShowAnswer] = useState(false);

  const render = async () => {
    const newborn = (await d3.dsv(",", "/data/newborn.csv"))
      .map((d) => ({
        year: Number(d.year),
        newborn: Number(d.newborn),
      }))
      .filter((_, i) => i % 3 === 0);

    console.log({ newborn });

    const childPlot = Plot.plot({
      width: 800,
      height: 600,
      marginLeft: 100,
      marginTop: 50,
      marginBottom: 60,

      marks: [
        Plot.barY(newborn, { x: "year", y: "newborn", fill: "transparent" }),
        Plot.text(newborn, {
          text: (d) => "\n👶".repeat(Math.floor(d.newborn / 59000)),
          x: "year",
          fontSize: 30,
          lineAnchor: "bottom",
          y: 0,
        }),
      ],
    });

    divRef.current?.appendChild(childPlot);
  };

  useOnRender(() => {
    render();
  });

  const unveil = useCallback(() => {
    lock();
    setShowAnswer(true);
    setTimeout(unlock, 1500);
  }, []);

  return (
    <PageTemplate onWheelDown={!showAnswer ? unveil : goDown} odd>
      <Flex w="100%" h="100%" flexDirection={"column"} p={40}>
        <Flex flexDir={"column"} p={30}>
          <Text type="SemiBold" fontSize={42}>
            <span style={{ color: COLORS.RED }}>고령화</span>란 무엇일까요?
          </Text>

          <Flex mt={16}>
            <Text type="SemiBold" fontSize={36}>
              전체 인구 가운데
            </Text>

            <Text position={"relative"} type="SemiBold" fontSize={36} px={10}>
              노인 인구
              <Flex
                justifyContent={"center"}
                pos={"absolute"}
                flex={1}
                left={5}
                right={5}
                top={0}
                transition="1s cubic-bezier(0.5, 0, 0.5, 1)"
                bottom={0}
                bgColor={"white"}
                rounded={10}
                border="2px solid gray"
                opacity={showAnswer ? 0 : 1}
              >
                ?
              </Flex>
            </Text>

            <Text type="SemiBold" fontSize={36}>
              가 차지하는 정도가 커지는 현상{" "}
            </Text>
          </Flex>
        </Flex>

        <Flex flex={1} alignItems={"center"} justifyContent={"center"}>
          <div ref={divRef}></div>
        </Flex>
      </Flex>
    </PageTemplate>
  );
};

export default OldTermPage;

/**
 * 
 * 
 * 

  const oldPlot = Plot.plot({
    width: 800,
    height: 600,
    marginLeft: 100,
    marginTop: 50,
    marginBottom: 60,

    marks: [
      Plot.barY(newborn, { x: "year", y: "newborn", fill: "transparent" }),
      Plot.text(newborn, {
        text: (d) => "\n👶".repeat(Math.floor(d.newborn / 59000)),
        x: "year",
        fontSize: 30,
        lineAnchor: "bottom",
        y: 0,
      }),
    ],
  });

 */

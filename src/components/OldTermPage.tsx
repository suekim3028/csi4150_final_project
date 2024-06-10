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
  const { goDown, lock } = useScrollContext();
  const divRef = useRef<HTMLDivElement>(null);

  const [showAnswer, setShowAnswer] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const render = async () => {
    const data = (await d3.dsv(",", "/data/age_type_population.csv"))
      .map((d) => ({
        ...d,
        year: Number(d.year),
        children: Number(d.children),
        production: Number(d.production),
        aging: Number(d.production),
      }))

      .filter((_, i) => i % 3 === 0)
      .reduce((prev, curr) => {
        return [
          ...prev,
          { year: curr.year, name: "children", value: curr.children },
          { year: curr.year, name: "production", value: curr.production },
          { year: curr.year, name: "aging", value: curr.aging },
        ];
      }, []);

    const parentWidth = containerRef.current?.clientWidth || 800;
    const parentHeight = containerRef.current?.clientHeight || 600;
    const width = parentWidth * 0.6;
    const height = parentHeight;

    console.log(data);
    const childPlot = Plot.plot({
      width,
      height,
      marginLeft: 100,
      marginTop: 50,
      marginBottom: 60,
      marks: [
        Plot.barY(
          data,
          Plot.stackY({
            x: "year",
            y: "value",
            fill: "name",
            offset: "normalize",
            tip: true,
            sort: { color: null, y: "x", reduce: "last" },
          })
        ),

        Plot.image(
          data,

          Plot.stackY(
            {
              offset: "normalize",
            },
            {
              x: "year",
              y: "value",
              src: (d) => {
                switch (d.name) {
                  case "children":
                    return "baby.svg";
                  case "production":
                    return "child.svg";
                  case "aging":
                    return "old.svg";
                }
              },
              width: Math.min(40, width / 18 - 5),
            }
          )
        ),

        Plot.ruleY([0]),
      ],
    });

    divRef.current?.appendChild(childPlot);
  };

  useOnRender(() => {
    render();
  });

  const unveil = useCallback(() => {
    lock(1500);
    setShowAnswer(true);
  }, []);

  return (
    <PageTemplate onWheelDown={!showAnswer ? unveil : goDown} odd>
      <Flex w="100%" h="100%" flexDirection={"column"} p={40}>
        <Flex flexDir={"column"} p={30}>
          <Text type="Medium" fontSize={30} mb={40}>
            아래의 현상을 보고 답해보세요!
          </Text>
          <Text type="SemiBold" fontSize={42}>
            <span style={{ color: COLORS.RED }}>고령화</span>란 무엇일까요?
          </Text>

          <Flex mt={16} ml={20}>
            <Text type="SemiBold" fontSize={36}>
              전체 인구 가운데
            </Text>

            <Text
              position={"relative"}
              type="SemiBold"
              fontSize={36}
              px={10}
              color={COLORS.BLUE}
            >
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
                color={COLORS.BLUE}
              >
                ?
              </Flex>
            </Text>

            <Text type="SemiBold" fontSize={36}>
              가 차지하는 정도가 커지는 현상{" "}
            </Text>
          </Flex>
        </Flex>

        <Flex
          flex={1}
          alignItems={"center"}
          justifyContent={"center"}
          ref={containerRef}
        >
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

import { Flex } from "@chakra-ui/react";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import React, { useCallback, useRef, useState } from "react";
import { COLORS } from "../constants";
import { useScrollContext } from "../contexts/ScrollContext";
import { useOnRender } from "../hooks/useOnRender";
import PageTemplate from "./PageTemplate";
import Text from "./Text";

const BarRacePage = () => {
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
    setTimeout(unlock, 1000);
  }, []);

  return (
    <PageTemplate onWheelDown={!showAnswer ? unveil : goDown} odd>
      <Flex w="100%" h="100%" flexDirection={"column"} p={40}>
        <Flex flexDir={"column"} p={30}>
          <Text type="SemiBold" fontSize={42} color={COLORS.PURPLE}>
            지역별 신생아수 달리기!
          </Text>
          <Text type="Medium" fontSize={36}>
            어떤 특징이 있나요?
          </Text>
          <video src={"/data/temp_run.mov"} width={"90%"} autoPlay />
        </Flex>
      </Flex>
    </PageTemplate>
  );
};

export default BarRacePage;

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

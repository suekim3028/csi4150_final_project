import { Flex } from "@chakra-ui/react";
import * as d3 from "d3";
import React, { useCallback, useRef, useState } from "react";
import { COLORS } from "../constants";
import { useScrollContext } from "../contexts/ScrollContext";
import { useOnRender } from "../hooks/useOnRender";
import PageTemplate from "./PageTemplate";
import Text from "./Text";

const EffectPage = () => {
  const { goDown, lock, unlock } = useScrollContext();
  const divRef = useRef<HTMLDivElement>(null);

  const [showAnswer, setShowAnswer] = useState(false);
  const [answer, setAnswer] = useState<null | number>(0);

  const render = async () => {
    // set the dimensions and margins of the graph
    const width = 450,
      height = 450,
      margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin;

    // append the svg object to the div called 'my_dataviz'
    const svg = d3
      .select(divRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Create dummy data
    const data = { "1인가구": 34.5, "": 65.5 };

    // set the color scale
    const color = d3.scaleOrdinal().range(d3.schemeObservable10);

    // Compute the position of each group on the pie:
    const pie = d3.pie().value(function (d) {
      return d[1];
    });
    const data_ready = pie(Object.entries(data));
    // Now I know that group A goes from 0 degrees to x degrees and so on.

    // shape helper to build arcs:
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll("mySlices")
      .data(data_ready)
      .join("path")
      .attr("d", arcGenerator)
      .attr("fill", function (d) {
        return color(d.data[0]);
      })
      .attr("stroke", "gray")
      .style("stroke-width", "1px")
      .style("opacity", 0.7);

    // Now add the annotation. Use the centroid method to get the best coordinates
    svg
      .selectAll("mySlices")
      .data(data_ready)
      .join("text")
      .text(function (d) {
        return d.data[0];
      })
      .attr("transform", function (d) {
        return `translate(${arcGenerator.centroid(d)})`;
      })
      .style("text-anchor", "middle");
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
              <Flex opacity={answer === null ? 1 : answer === index ? 1 : 0.2}>
                <Text type={"Medium"} fontSize={40} mr={10} color={COLORS.BLUE}>
                  {index + 1}.
                </Text>
                <Text type={"Medium"} fontSize={40}>
                  {question}
                </Text>
              </Flex>
            ))}
          </Flex>
          <Flex flexDir={"column"}>
            <div ref={divRef} />
          </Flex>
        </Flex>
      </Flex>
    </PageTemplate>
  );
};

const questions = ["1인 가구 수", "과일 가격의 상승", "요양 병원 증가"];

export default EffectPage;

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

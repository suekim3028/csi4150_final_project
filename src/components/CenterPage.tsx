import { Flex } from "@chakra-ui/react";
import * as d3 from "d3";
import React, { useRef, useState } from "react";
import { COLORS } from "../constants";
import { useScrollContext } from "../contexts/ScrollContext";
import { useOnRender } from "../hooks/useOnRender";
import PageTemplate from "./PageTemplate";
import Text from "./Text";

const CenterPage = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const data = useRef<{
    data: { year: number; value: number }[];
    svgs: Node[];
  }>();
  const { goDown, lock } = useScrollContext();

  const [year, setYear] = useState(2000);

  const [showChange, setShowChange] = useState(false);
  const showingChange = useRef(false);
  const yearRef = useRef(2000);

  const render = async () => {
    const data = await d3.dsv(",", "/data/hospital_count.csv");

    const parentWidth = divRef.current?.clientWidth || 500;
    const parentHeight = divRef.current?.clientHeight || 450;

    const margin = { top: 10, right: 30, bottom: 50, left: 60 };

    const width = parentWidth * 0.5;
    const height = parentHeight * 0.8;

    // append the svg object to the body of the page
    const svg = d3
      .select(divRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.YEAR))
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // svg.append("text")
    //   .attr("text-anchor", "end")
    //   .attr("x", width / 2)
    //   .attr("y", height + margin.bottom - 10)
    //   .text("년도");

    const y = d3.scaleLinear().domain([500, 1700]).range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    // svg.append("text")
    //   .attr("text-anchor", "end")
    //   .attr("transform", "rotate(-90)")
    //   .attr("x", -height / 2)
    //   .attr("y", -margin.left + 20)
    //   .text("요양병원수");

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", COLORS.PALE_GREEN)
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(d.YEAR))
          .y((d) => y(d.COUNT))
      );

    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d.YEAR))
      .attr("cy", (d) => y(d.COUNT))
      .attr("r", 5)
      .attr("fill", COLORS.PALE_GREEN);
  };

  useOnRender(() => {
    render();
  });

  return (
    <PageTemplate onWheelDown={() => undefined}>
      <Flex w="100%" h="100%" flexDirection={"column"} p={40} flex={0}>
        <Flex flexDir={"column"} p={30}>
          <Text type="SemiBold" fontSize={42} color={COLORS.BROWN}>
            요양 병원의 증가
          </Text>
        </Flex>
      </Flex>

      <Flex
        ref={divRef}
        alignItems={"center"}
        justifyContent={"center"}
        flex={1}
      ></Flex>
    </PageTemplate>
  );
};

export default CenterPage;

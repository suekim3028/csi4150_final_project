import { Flex } from "@chakra-ui/react";
import * as d3 from "d3";
import React, { useCallback, useRef, useState } from "react";
import { COLORS } from "../constants";
import { useScrollContext } from "../contexts/ScrollContext";
import { useOnRender } from "../hooks/useOnRender";
import PageTemplate from "./PageTemplate";
import Text from "./Text";

const margin = { top: 10, right: 100, bottom: 100, left: 30 },
  width = 900 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

const CompareCountriesPage = () => {
  const { goDown, lock, unlock } = useScrollContext();
  const svgRef = useRef<SVGSVGElement>(null);

  const [showChart, setShowChart] = useState(false);

  const render = async () => {
    if (!svgRef.current) return;
    const data = await d3.dsv(",", "/data/aging_index.csv");

    renderChart(data, svgRef.current);

    // set the dimensions and margins of the graphs
    // append the svg object to t
  };

  useOnRender(() => {
    render();
  });

  const unveil = useCallback(() => {
    lock();
    setShowChart(true);
    console.log("??");

    const svg = d3.select(svgRef.current);

    svg
      .selectAll(".myLabels text")
      .transition()
      .ease(d3.easeCubic)
      .duration(1000)
      .style("opacity", 1);
    svg
      .selectAll(".legend text")
      .transition()
      .duration(1000)
      .ease(d3.easeCubic)
      .style("opacity", 1);

    // Set opacity of INDIA and JAPAN lines and dots to 0.5
    svg
      .selectAll(".INDIA.myLines, .INDIA.myDots circle ")
      .transition()
      .ease(d3.easeCubic)
      .duration(1000)
      .style("opacity", 0.2);

    svg
      .selectAll(".JAPAN.myLines, .JAPAN.myDots ")
      .transition()
      .ease(d3.easeCubic)
      .duration(1000)

      .style("opacity", 0.2);

    setTimeout(unlock, 3000);
  }, []);

  return (
    <PageTemplate onWheelDown={!showChart ? unveil : goDown} odd>
      <Flex
        flexDir={"column"}
        p={70}
        flex={1}
        alignSelf={"flex-start"}
        justifySelf={"flex-start"}
        justifyContent={"flex-start"}
      >
        <Text type="SemiBold" fontSize={42}>
          다음 중
          <span style={{ color: COLORS.GREEN, marginLeft: 10 }}>
            한국의 고령화지수
          </span>
          를 표현한 선은 무엇일까요?
        </Text>
      </Flex>
      <Flex px={80} py={40} h="100%" flexDir={"column"} alignItems={"center"}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom
          }`}
          width={width + margin.left + margin.right}
          height={height + margin.top + margin.bottom}
        >
          <g transform={"translate(" + 0 + "," + margin.top + ")"}></g>
        </svg>

        <Flex opacity={showChart ? 1 : 0} transition={"1s linear"}>
          <Text
            color={COLORS.RED}
            type={"Medium"}
            py={8}
            px={40}
            border={"1px solid rgba(0,0,0,0.3)"}
            bgColor={"white"}
            rounded={15}
            onClick={() => {
              const svg = d3.select(svgRef.current);
              svg
                .selectAll(".JAPAN.myLines, .JAPAN.myDots circle")
                .transition()
                .style("opacity", 1);
              svg
                .selectAll(".myLabels .JAPAN")
                .transition()
                .style("opacity", 1);
              svg
                .selectAll(".INDIA.myLines, .INDIA.myDots circle")
                .transition()
                .style("opacity", 0);
              svg
                .selectAll(".myLabels .INDIA")
                .transition()
                .style("opacity", 0);
            }}
          >
            일본
          </Text>

          <Text
            ml={20}
            color={COLORS.BLUE}
            type={"Medium"}
            py={8}
            px={40}
            border={"1px solid rgba(0,0,0,0.3)"}
            bgColor={"white"}
            rounded={15}
            onClick={() => {
              const svg = d3.select(svgRef.current);
              svg
                .selectAll(".INDIA.myLines, .INDIA.myDots circle")
                .transition()
                .style("opacity", 1);
              svg
                .selectAll(".myLabels .INDIA")
                .transition()
                .style("opacity", 1);
              svg
                .selectAll(".JAPAN.myLines, .JAPAN.myDots circle")
                .transition()
                .style("opacity", 0);
              svg
                .selectAll(".myLabels .JAPAN")
                .transition()
                .style("opacity", 0);
            }}
          >
            인도
          </Text>
        </Flex>
      </Flex>
    </PageTemplate>
  );
};

export default CompareCountriesPage;

const renderChart = function (_data, _svg) {
  const svg = d3.select(_svg);
  var allGroup = ["KOREA", "JAPAN", "INDIA"];
  console.log({ _data });

  const data = _data.map((d) => ({ ...d, YEAR: Number(d.YEAR) }));

  var dataReady = allGroup.map(function (grpName) {
    return {
      name: grpName,
      values: data.map(function (d) {
        return { time: d.YEAR, value: +d[grpName] };
      }),
    };
  });

  console.log(dataReady);

  var myColor = d3.scaleOrdinal().domain(allGroup).range(d3.schemeSet2);

  var x = d3.scaleLinear().domain([1990, 2060]).range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  var y = d3.scaleLinear().domain([0, 600]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  var line = d3
    .line()
    .x(function (d) {
      return x(+d.time);
    })
    .y(function (d) {
      return y(+d.value);
    });

  svg
    .selectAll("myLines")
    .data(dataReady)
    .enter()
    .append("path")
    .attr("class", function (d) {
      return d.name + " myLines";
    })
    .attr("d", function (d) {
      return line(d.values);
    })
    .attr("stroke", function (d) {
      return myColor(d.name);
    })
    .style("stroke-width", 4)
    .style("fill", "none");

  svg
    .selectAll("myDots")
    .data(dataReady)
    .enter()
    .append("g")
    .style("fill", function (d) {
      return myColor(d.name);
    })
    .attr("class", function (d) {
      return d.name + " myDots";
    })
    .selectAll("myPoints")
    .data(function (d) {
      return d.values;
    })
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.time);
    })
    .attr("cy", function (d) {
      return y(d.value);
    })
    .attr("r", 5)
    .attr("stroke", "white");

  var labelGroup = svg
    .selectAll("myLabels")
    .data(dataReady)
    .enter()
    .append("g")
    .attr("class", "myLabels");

  labelGroup
    .append("text")
    .attr("class", function (d) {
      return d.name;
    })
    .datum(function (d) {
      return { name: d.name, value: d.values[d.values.length - 1] };
    })
    .attr("transform", function (d) {
      return "translate(" + x(d.value.time) + "," + y(d.value.value) + ")";
    })
    .attr("x", 12)
    .text(function (d) {
      return d.name;
    })
    .style("fill", function (d) {
      return myColor(d.name);
    })
    .style("font-size", 15)
    .style("opacity", 0); // Initially set opacity to 0
};

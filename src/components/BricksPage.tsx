import { Flex } from "@chakra-ui/react";
import * as d3 from "d3";
import React, { useCallback, useRef, useState } from "react";
import { COLORS } from "../constants";
import { useScrollContext } from "../contexts/ScrollContext";
import { useOnRender } from "../hooks/useOnRender";
import PageTemplate from "./PageTemplate";
import Text from "./Text";

const margin = { top: 100, right: 30, bottom: 0, left: 100 };
const width = 550 - margin.left - margin.right; // 이전보다 더 큰 너비
const height = 450 - margin.top - margin.bottom; // 이전보다 더 큰 높이

// Define image URL
const brickImageURL = "bricks.png"; // 벽돌 PNG 파일 경로
const brickWidth = 20; // 이미지 하나의 너비
const brickHeight = 20; // 이미지 하나의 높이

const BricksPage = () => {
  const { goDown, lock } = useScrollContext();
  const svg1Ref = useRef<SVGSVGElement>(null);
  const svg2Ref = useRef<SVGSVGElement>(null);

  const [showChart, setShowChart] = useState(false);

  const render = async () => {
    if (!svg1Ref.current || !svg2Ref.current) return;
    createChart(svg1Ref.current, await d3.csv("/data/data_korea.csv"));
    createChart(svg2Ref.current, await d3.csv("/data/data_india.csv"));

    // set the dimensions and margins of the graphs
    // append the svg object to t
  };

  useOnRender(() => {
    render();
  });

  const unveil = useCallback(() => {
    lock(3000);
    setShowChart(true);

    // 모든 .bar-image 요소의 표시 상태를 토글
    d3.selectAll(".bar-image").style("opacity", 0);

    // 나머지 요소들의 표시 상태를 변경
    const elementsToToggle = d3.selectAll(
      ".barMale, .barFemale, .x-axis-male, .x-axis-female, .y-axis, .grid, .chart-title, .legend-rect-male, .legend-text-male, .legend-rect-female, .legend-text-female"
    );
    elementsToToggle.style("opacity", 1);
  }, []);

  return (
    <PageTemplate onWheelDown={!showChart ? unveil : goDown}>
      <Flex w="100%" h="100%" flexDirection={"column"} p={40} flex={0}>
        <Flex flexDir={"column"} p={30}>
          <Text type="SemiBold" fontSize={42}>
            다음 중
            <span style={{ color: COLORS.BLUE, marginLeft: 10 }}>
              더 안정적인 벽돌 탑
            </span>
            은 무엇일까요?
          </Text>
        </Flex>
      </Flex>
      <Flex flex={1} px={80} pb={40} w="100%" h="100%">
        <Flex flex={1} flexDir={"column"} justifyContent={"center"}>
          <svg
            ref={svg1Ref}
            viewBox={`0 0 ${width + margin.left + margin.right} ${
              height + margin.top + margin.bottom
            }`}
          ></svg>
          <Text type={"SemiBold"} color={COLORS.RED} fontSize={25}>
            한국의 연령대별 인구구조
          </Text>
        </Flex>
        <Flex flex={1} flexDir={"column"} justifyContent={"center"}>
          <svg
            ref={svg2Ref}
            viewBox={`0 0 ${width + margin.left + margin.right} ${
              height + margin.top + margin.bottom
            }`}
          ></svg>
          <Text type={"SemiBold"} color={COLORS.RED} fontSize={25}>
            인도의 연령대별 인구구조
          </Text>
        </Flex>
      </Flex>
    </PageTemplate>
  );
};

export default BricksPage;

const createChart = (_svg, data) => {
  const svg = d3.select(_svg);
  // X scale and Axis
  const xScaleMale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d.male)])
    .range([width / 2, 0]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("class", "x-axis-male")
    .call(d3.axisBottom(xScaleMale).tickSize(0).tickPadding(3).ticks(7, "%"))
    .call(function (d) {
      return d.select(".domain").remove();
    });

  const xScaleFemale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d.female)])
    .range([width / 2, width]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("class", "x-axis-female")
    .call(d3.axisBottom(xScaleFemale).tickSize(0).tickPadding(3).ticks(7, "%"))
    .call(function (d) {
      return d.select(".domain").remove();
    });

  // set vertical grid line
  const GridLineF = function () {
    return d3.axisBottom().scale(xScaleFemale);
  };
  svg
    .append("g")
    .attr("class", "grid grid-female")
    .call(GridLineF().tickSize(height, 0, 0).tickFormat("").ticks(7));
  const GridLineM = function () {
    return d3.axisBottom().scale(xScaleMale);
  };
  svg
    .append("g")
    .attr("class", "grid grid-male")
    .call(GridLineM().tickSize(height, 0, 0).tickFormat("").ticks(7));

  // Y scale and Axis
  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.ages))
    .range([height, 0])
    .padding(0.25);
  svg
    .append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale).tickSize(0).tickPadding(15))
    .call((d) => d.select(".domain").remove());

  // create a tooltip
  const tooltip = d3.select("body").append("div").attr("class", "tooltip");

  // tooltip events
  const mouseover = function (d) {
    tooltip.style("opacity", 1);
    d3.select(this).style("stroke", "#EF4A100").style("opacity", 0.5);
  };
  const mousemove1 = function (event, d) {
    tooltip
      .html(`${d.male * 100}%`)
      .style("top", event.pageY - 10 + "px")
      .style("left", event.pageX + 10 + "px");
  };
  const mousemove2 = function (event, d) {
    tooltip
      .html(`${d.female * 100}%`)
      .style("top", event.pageY - 10 + "px")
      .style("left", event.pageX + 10 + "px");
  };
  const mouseleave = function (d) {
    tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "none").style("opacity", 1);
  };

  // function to create repeated images
  const createImages = (parent, x, y, width, height, imageUrl) => {
    const rows = Math.ceil(height / brickHeight);
    const cols = Math.ceil(width / brickWidth);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        parent
          .append("image")
          .attr("x", x + j * brickWidth)
          .attr("y", y + i * brickHeight)
          .attr("width", brickWidth)
          .attr("height", brickHeight)
          .attr("xlink:href", imageUrl)
          .attr("class", "bar-image");
      }
    }
  };

  // create male bars
  data.forEach((d) => {
    createImages(
      svg,
      xScaleMale(d.male),
      yScale(d.ages),
      width / 2 - xScaleMale(d.male),
      yScale.bandwidth(),
      brickImageURL
    );
  });

  // create female bars
  data.forEach((d) => {
    createImages(
      svg,
      xScaleFemale(0),
      yScale(d.ages),
      xScaleFemale(d.female) - xScaleFemale(0),
      yScale.bandwidth(),
      brickImageURL
    );
  });

  // set title
  // svg
  //   .append("text")
  //     .attr("class", "chart-title")
  //     .attr("x", -(margin.left)*0.7)
  //     .attr("y", -(margin.top)/1.5)
  //     .attr("text-anchor", "start")
  //   .text("Demographics of forcibly displaced people | 2020")

  // set legend
  svg
    .append("rect")
    .attr("x", -margin.left * 0.7)
    .attr("y", -(margin.top / 3))
    .attr("width", 13)
    .attr("height", 13)
    .style("fill", "#ff725c")
    .attr("class", "legend-rect-male");
  svg
    .append("text")
    .attr("class", "legend legend-text-male")
    .attr("x", -margin.left * 0.6 + 15)
    .attr("y", -(margin.top / 5.5))
    .text("남자");
  svg
    .append("rect")
    .attr("x", 40)
    .attr("y", -(margin.top / 3))
    .attr("width", 13)
    .attr("height", 13)
    .style("fill", "#efb118")
    .attr("class", "legend-rect-female");
  svg
    .append("text")
    .attr("class", "legend legend-text-female")
    .attr("x", 100)
    .attr("y", -(margin.top / 5.5))
    .text("여자");

  svg
    .selectAll(".barMale")
    .data(data)
    .join("rect")
    .attr("class", "barMale")
    .attr("x", (d) => xScaleMale(d.male))
    .attr("y", (d) => yScale(d.ages))
    .attr("width", (d) => width / 2 - xScaleMale(d.male))
    .attr("height", yScale.bandwidth())
    .style("fill", "#ff725c")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove1)
    .on("mouseleave", mouseleave);

  // Female bars 생성
  svg
    .selectAll(".barFemale")
    .data(data)
    .join("rect")
    .attr("class", "barFemale")
    .attr("x", xScaleFemale(0))
    .attr("y", (d) => yScale(d.ages))
    .attr("width", (d) => xScaleFemale(d.female) - xScaleFemale(0))
    .attr("height", yScale.bandwidth())
    .style("fill", "#efb118")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove2)
    .on("mouseleave", mouseleave);

  // 초기에는 요소를 숨김

  const charts = d3.selectAll(
    ".barMale, .barFemale, .x-axis-male, .x-axis-female, .y-axis, .grid, .chart-title, .legend-rect-male, .legend-text-male, .legend-rect-female, .legend-text-female"
  );

  charts.style("opacity", 0);
  charts.style("transition", "1s linear");
  charts.style("webkit-transition", "1s linear");

  const image = d3.selectAll(".bar-image");

  image.style("opacity", 1);
  image.style("transition", "0.5s 0.5s linear");
  image.style("webkit-transition", "0.5s 0.5s linear");
};

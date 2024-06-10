import { Flex } from "@chakra-ui/react";
import * as d3 from "d3";
import React, { useCallback, useRef, useState } from "react";
import { COLORS } from "../constants";
import { useScrollContext } from "../contexts/ScrollContext";
import { useOnRender } from "../hooks/useOnRender";
import PageTemplate from "./PageTemplate";
import Text from "./Text";

const AlonePage = () => {
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

  const loadData = async () => {
    if (!data.current) {
      const d = await d3.dsv(",", "/data/live_alone.csv");

      const svgs = [
        (await d3.svg("live_alone.svg")).documentElement as Node,
        (await d3.svg("live_other0.svg")).documentElement as Node,
        (await d3.svg("live_other1.svg")).documentElement as Node,

        (await d3.svg("live_other3.svg")).documentElement as Node,
        (await d3.svg("live_other4.svg")).documentElement as Node,
      ];
      data.current = { data: d, svgs };
      render(2000);
    }
  };
  const render = async (currentYear: number) => {
    if (!data.current) return;
    const item = data.current.data.find(
      ({ year: _year }) => +_year === currentYear
    );
    if (!item) return;

    const alone = Math.round(item.value);

    const [aloneSvg, ...otherSvgs] = data.current.svgs;

    if (divRef.current) divRef.current.innerHTML = "";

    Array.from({ length: 100 }, (_, i) => {
      if (!divRef.current) return;

      // console.log(i);
      if (i <= alone) {
        d3.select(divRef.current?.appendChild(aloneSvg.cloneNode(true)))
          .style("width", 50)
          .style("height", 50)
          .attr("width", 50)
          .attr("height", 50)
          .attr("dx", i * 300 + (i - 1) * 20);
      } else {
        d3.select(divRef.current?.appendChild(otherSvgs[i % 4].cloneNode(true)))
          .style("width", 50)
          .style("opacity", 0.15)
          .style("height", 50)
          .attr("width", 50)
          .attr("height", 50)
          .attr("dx", i * 300 + (i - 1) * 20);
      }
    });
  };

  useOnRender(() => {
    loadData();
  });

  const onWheel = useCallback(() => {
    if (showChange) {
      goDown();
    } else {
      lock(500 * 24);
      setShowChange(true);

      const int = setInterval(() => {
        if (yearRef.current == 2022) {
          clearInterval(int);
          return;
        }
        setYear((y) => y + 1);
        yearRef.current += 1;
        render(yearRef.current);
      }, 500);
    }
  }, [showChange]);

  return (
    <PageTemplate onWheelDown={onWheel}>
      <Flex w="100%" h="100%" flexDirection={"column"} p={40} flex={0}>
        <Flex flexDir={"column"} p={30}>
          <Text type="SemiBold" fontSize={42} color={COLORS.GREEN}>
            1인 가구 수의 감소
          </Text>
        </Flex>
      </Flex>
      <Flex
        flexDir={"column"}
        flex={1}
        px={50}
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
      >
        <Text type={"Medium"} fontSize={24} p={20}>
          {year}년의 1인 가구 비율
        </Text>
        <Flex
          ref={divRef}
          flexWrap={"wrap"}
          alignItems={"flex-start"}
          justifyContent={"flex-start"}
        ></Flex>
      </Flex>
    </PageTemplate>
  );
};

export default AlonePage;

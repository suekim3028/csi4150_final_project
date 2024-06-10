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
  const divRef1 = useRef<HTMLDivElement>(null);
  const divRef2 = useRef<HTMLDivElement>(null);
  const data = useRef<{ year: number; value: number }[]>();
  const { goDown, lock } = useScrollContext();

  const [year, setYear] = useState(2000);

  const [showChange, setShowChange] = useState(false);
  const showingChange = useRef(false);
  const yearRef = useRef(2000);

  const loadData = async () => {
    if (!data.current) {
      data.current = await d3.dsv(",", "/data/live_alone.csv");

      const [aloneSvg, ...otherSvgs] = [
        (await d3.svg("live_alone.svg")).documentElement as Node,
        (await d3.svg("live_other0.svg")).documentElement as Node,
        (await d3.svg("live_other1.svg")).documentElement as Node,

        (await d3.svg("live_other3.svg")).documentElement as Node,
        (await d3.svg("live_other4.svg")).documentElement as Node,
      ];

      Array.from({ length: 100 }, (_, i) => {
        if (!divRef1.current || !divRef2.current) return;

        // console.log(i);

        d3.select(divRef1.current?.appendChild(aloneSvg.cloneNode(true)))
          .style("width", 50)
          .style("height", 50)
          .attr("width", 50)
          .attr("height", 50)
          .style("opacity", 0)
          .attr("dx", i * 300 + (i - 1) * 20)
          .style("transition", "1s linear");

        d3.select(
          divRef2.current?.appendChild(otherSvgs[i % 4].cloneNode(true))
        )
          .style("width", 50)
          .style("opacity", 0)
          .style("height", 50)
          .attr("width", 50)
          .attr("height", 50)
          .attr("dx", i * 300 + (i - 1) * 20)
          .style("transition", "1s linear");
      });

      render(2000);
    }
  };

  const render = async (currentYear: number) => {
    if (!data.current) return;
    console.log("------");
    const item = data.current.find(({ year: _year }) => +_year === currentYear);
    if (!item) return;

    const alone = Math.round(item.value);

    const aloneSvgs = divRef1.current?.querySelectorAll("svg");
    const otherSvgs = divRef2.current?.querySelectorAll("svg");
    console.log("jwl3ofeijaw;oifjew;al");
    console.log({ aloneSvgs });
    if (!aloneSvgs || !otherSvgs) return;

    Array.from({ length: 100 }, (_, i) => {
      aloneSvgs.item(i).style.opacity = i < alone ? "1" : "0";
      otherSvgs.item(i).style.opacity = i < alone ? "0" : "0.3";
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
      }, 200);
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
        <Text type={"Medium"} fontSize={40} color={COLORS.BLUE}>
          {year}년
        </Text>
        <Text type={"Medium"} fontSize={34}>
          1인 가구 비율
        </Text>
        <Flex
          flexGrow={1}
          w="100%"
          mb={50}
          position={"relative"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Flex
            pos={"absolute"}
            ref={divRef1}
            flexWrap={"wrap"}
            alignItems={"flex-start"}
            justifyContent={"center"}
            width="60%"
            height="60%"
          ></Flex>
          <Flex
            pos={"absolute"}
            flex={1}
            ref={divRef2}
            flexWrap={"wrap"}
            alignItems={"flex-start"}
            justifyContent={"center"}
            width="60%"
            height="60%"
          ></Flex>
        </Flex>
      </Flex>
    </PageTemplate>
  );
};

export default AlonePage;

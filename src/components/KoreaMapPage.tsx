import { Flex } from "@chakra-ui/react";
import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import { COLORS } from "../constants";
import { useScrollContext } from "../contexts/ScrollContext";
import { useOnRender } from "../hooks/useOnRender";
import PageTemplate from "./PageTemplate";
import Text from "./Text";

const KoreaMapPage = () => {
  const { goDown, lock } = useScrollContext();

  const containerRef = useRef<HTMLDivElement>(null);

  const [showAnswer, setShowAnswer] = useState(false);

  const [year, setYear] = useState(1970);

  const dataRef = useRef<any>();

  const color = d3.scaleOrdinal().domain([0, 1, 2]).range(d3.schemeAccent);

  const draw = async () => {
    if (!dataRef.current) {
      const data = Array.from(
        { length: 2050 - 1970 + 1 },
        (_, i) => i + 1970
      ).reduce((prev, year) => {
        return {
          ...prev,
          [year]: populationByRegion(),
        };
      }, {});

      const d = await d3.dsv(",", "/data/korea_population.csv");
      d.forEach((curr) => {
        const age = curr["연령별"];

        if (!(age in typeByAge)) return;
        const name = curr["시도별"];

        const type = typeByAge[age];

        const year = curr["시점"];
        const population = curr["추계인구"];

        data[year][name][type] += Number(population);
      });

      dataRef.current = data;
    }

    console.log("data 완성!!!!");
    if (!dataRef.current) return;
    console.log("====");

    const svg = d3.select(containerRef.current).select("svg");
    console.log(svg);

    svg.selectAll("g#populationGroup").remove();
    const row = dataRef.current[year];

    Object.keys(row).forEach((name) => {
      const {
        children: _children,
        production: _production,
        old: _old,
      } = row[name];
      const children = Math.floor(_children / 100000);
      const production = Math.floor(_production / 100000);
      const old = Math.floor(_old / 100000);
      const region = REGION_BY_NAME[name];
      const code = CODE_BY_REGION[region];

      const { cx: x, cy: y } = REGION_BOX[code];

      const group = svg
        .append("g")
        .attr("id", "populationGroup")
        .attr("width", 40)
        .attr("height", 200);

      const types = [children, production, old];
      const sum = children + production + old;
      group.attr("transform", `translate(${x - 25},${y - (sum / 10) * 4})`);

      [
        ...Array.from({ length: children }, () => 0),
        ...Array.from({ length: production }, () => 1),
        ...Array.from({ length: old }, () => 2),
      ].forEach((t, i) => {
        const cx = (i % 6) * 20 + (i % 6) * 1;
        const cy = Math.floor(i / 6) * 20 + Math.floor(i / 6) * 2;

        group
          .append("text")
          .text(t === 0 ? "👶" : t === 1 ? "🧑‍✈️" : "👵")
          .attr("x", `${cx}`)
          .attr("y", `${cy}`);
      });
    });
  };

  useEffect(() => {
    if (year === 1970) return;
    draw();
  }, [year]);

  useOnRender(() => {
    (async () => {
      const koreaMap = (await d3.svg("korea.svg")).documentElement as Node;

      const parentWidth = containerRef.current?.clientWidth || 800;
      const parentHeight = containerRef.current?.clientHeight || 600;

      console.log({ parentWidth, parentHeight });
      const size = Math.min(parentWidth, parentHeight);

      const svg = d3
        .select(containerRef?.current?.appendChild(koreaMap.cloneNode(true)))
        .attr("transform", "scale(0.6)");

      console.log("===");
      draw();
    })();
  });

  const yearUp = () => {
    if (year === 2050) return goDown();
    // lock(500);
    setYear(year + 1);
  };

  return (
    <PageTemplate onWheelDown={yearUp}>
      <Flex flexDirection={"column"} p={40} flex={1}>
        <Flex flexDir={"column"} p={30} flex={0}>
          <Text type="SemiBold" fontSize={42} color={COLORS.RED}>
            한국 인구구조의 변화
          </Text>

          <Text type="Medium" fontSize={24} textAlign={"start"}>
            {`새로 태어난 아기👶와 일을 할 수 있는 청년🧑‍✈️, 65세 이상의 노인👵이 있어요.
            그 수가 어떻게 변화하고 있나요?\n지역별로는 어떤 차이가 있나요?`}
          </Text>
        </Flex>
        <Flex flex={1}>
          <div
            ref={containerRef}
            style={{ width: "100%", height: "100%" }}
          ></div>
        </Flex>
      </Flex>
    </PageTemplate>
  );
};

export default KoreaMapPage;

const CODE_BY_REGION = {
  Seoul: "KR11",
  Busan: "KR26",
  Daegu: "KR27",
  Incheon: "KR28",
  Gwangju: "KR29",
  Daejeon: "KR30",
  Ulsan: "KR31",
  Gyeonggi: "KR41",
  Gangwon: "KR42",
  "North Chungcheong": "KR43",
  "South Chungcheong": "KR44",
  "North Jeolla": "KR45",
  "South Jeolla": "KR46",
  "North Gyeongsang": "KR47",
  "South Gyeongsang": "KR48",
  Jeju: "KR49",
  Sejong: "KR50",
};

const REGION_BY_NAME = {
  서울특별시: "Seoul",
  부산광역시: "Busan",
  대구광역시: "Daegu",
  인천광역시: "Incheon",
  광주광역시: "Gwangju",
  대전광역시: "Daejeon",
  울산광역시: "Ulsan",
  경기도: "Gyeonggi",
  강원도: "Gangwon",
  충청북도: "North Chungcheong",
  충청남도: "South Chungcheong",
  전라북도: "North Jeolla",
  전라남도: "South Jeolla",
  경상북도: "North Gyeongsang",
  경상남도: "South Gyeongsang",
  제주특별자치도: "Jeju",
  세종특별자치시: "Sejong",
};

const REGION_NAMES = Object.keys(REGION_BY_NAME);

const REGION_BOX = {
  KR50: { x2: 445, cy: "399.9", cx: "416", y: 377, x: 404, y2: 419 },
  KR41: { x2: 509, cy: "270.8", cx: "447.8", y: 118, x: 73, y2: 345 },
  KR30: { x2: 461, cy: "435.3", cx: "446.6", y: 412, x: 426, y2: 454 },
  KR31: { x2: 731, cy: "576.3", cx: "698.3", y: 546, x: 666, y2: 607 },
  KR11: { x2: 422, cy: "80", cx: "337.4", y: 208, x: 368, y2: 251 },
  KR43: { x2: 620, cy: "362.4", cx: "481.3", y: 287, x: 425, y2: 497 },
  KR42: { x2: 731, cy: "195.3", cx: "566.6", y: 46, x: 391, y2: 390 },
  KR27: { x2: 635, cy: "509.1", cx: "617.1", y: 491, x: 596, y2: 532 },
  KR26: { x2: 694, cy: "628.2", cx: "676.3", y: 614, x: 660, y2: 652 },
  KR47: { x2: 928, cy: "413.4", cx: "638.8", y: 231, x: 503, y2: 571 },
  KR46: { x2: 507, cy: "679.8", cx: "385.4", y: 583, x: 137, y2: 823 },
  KR45: { x2: 521, cy: "536.1", cx: "418.3", y: 471, x: 294, y2: 614 },
  KR44: { x2: 480, cy: "402.4", cx: "377", y: 315, x: 278, y2: 496 },
  KR49: { x2: 390, cy: "924.9", cx: "334.9", y: 895, x: 282, y2: 954 },
  KR48: { x2: 704, cy: "604", cx: "569.3", y: 512, x: 479, y2: 724 },
  KR29: { x2: 397, cy: "625.7", cx: "385.3", y: 617, x: 372, y2: 635 },
  KR28: { x2: 368, cy: "270.7", cx: "285", y: 230, x: 309, y2: 262 },
};

const div = d3.select("#koreaPopulation");
const labelPoints = [];

const typeByAge = {
  "0 - 4세": "children",
  "5 - 9세": "children",
  "10 - 14세": "children",
  "15 - 19세": "production",
  "20 - 24세": "production",
  "25 - 29세": "production",
  "30 - 34세": "production",
  "35 - 39세": "production",
  "40 - 44세": "production",
  "45 - 49세": "production",
  "50 - 54세": "production",
  "55 - 59세": "production",
  "60 - 64세": "production",
  "65 - 69세": "old",
  "70 - 74세": "old",
  "75 - 79세": "old",
  "80세이상": "old",
};

const populationByRegion = () =>
  REGION_NAMES.reduce((prev, name) => {
    return { ...prev, [name]: { children: 0, production: 0, old: 0 } };
  }, {});

import { Flex } from "@chakra-ui/react";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import React, { useRef } from "react";
import { useScrollContext } from "../contexts/ScrollContext";
import { useOnRender } from "../hooks/useOnRender";
import PageTemplate from "./PageTemplate";

const ChildTermPage = () => {
  const { goDown } = useScrollContext();
  const divRef = useRef<HTMLDivElement>(null);

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

  return (
    <PageTemplate onWheelDown={goDown}>
      <Flex w="100%" h="100%" flexDirection={"column"}>
        <div ref={divRef}></div>
      </Flex>
    </PageTemplate>
  );
};

export default ChildTermPage;

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

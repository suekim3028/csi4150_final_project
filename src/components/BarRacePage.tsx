import { Flex } from "@chakra-ui/react";
import * as d3 from "d3";
import React, { useCallback, useRef, useState } from "react";
import { COLORS } from "../constants";
import { useScrollContext } from "../contexts/ScrollContext";
import { useOnRender } from "../hooks/useOnRender";
import PageTemplate from "./PageTemplate";
import Text from "./Text";

const duration = 50;

const BarRacePage = () => {
  const { goDown, lock } = useScrollContext();

  const [canGoDown, setCanGoDown] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const keyframesRef = useRef<any[]>();
  const playing = useRef(false);

  const render = async (start: boolean) => {
    playing.current = true;
    const data = (await d3.dsv(",", "/data/region_babies.csv")).map((d) => ({
      ...d,
      date: new Date(+d.year, 0, 1, 0, 0, 0, 0),
      value: +d.value,
      category:
        d.name == "서울특별시" || d.name == "경기도" ? "city" : "country",
    }));

    const n = 16;
    const names = new Set(data.map((d) => d.name));

    const datevalues = Array.from(
      d3.rollup(
        data,
        ([d]) => +d.value,
        (d) => d.date,
        (d) => d.name
      )
    )
      .map((item: any) => item)
      .sort(([a], [b]) => d3.ascending(a, b));

    console.log({ datevalues });

    function rank(value) {
      const data = Array.from(names, (name): any => ({
        name,
        value: value(name),
      }));
      data.sort((a, b) => d3.descending(a.value, b.value));
      for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
      return data;
    }

    const k = 10;

    const keyframes = (() => {
      const keyframes: any[] = [];
      let ka, a, kb, b;
      for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
        for (let i = 0; i < k; ++i) {
          const t = i / k;
          keyframes.push([
            new Date(ka * (1 - t) + kb * t),
            rank(
              (name) => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t
            ),
          ]);
        }
      }
      keyframes.push([new Date(kb), rank((name) => b.get(name) || 0)]);
      return keyframes;
    })();

    keyframesRef.current = keyframes;

    const nameframes = d3.groups(
      keyframes.flatMap(([, data]) => data),
      (d) => d.name
    );
    const prev = new Map(
      nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a]))
    );
    const next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)));
    const formatNumber = d3.format(",d");
    console.log({ keyframes });

    function bars(svg) {
      let bar = svg.append("g").attr("fill-opacity", 0.6).selectAll("rect");

      return ([date, data], transition) =>
        (bar = bar
          .data(data.slice(0, n), (d) => d.name)
          .join(
            (enter) =>
              enter
                .append("rect")
                .attr("fill", color)
                .attr("height", y.bandwidth())
                .attr("x", x(0))
                .attr("y", (d) => y((prev.get(d) || d).rank))
                .attr("width", (d) => x((prev.get(d) || d).value) - x(0)),
            (update) => update,
            (exit) =>
              exit
                .transition(transition)
                .remove()
                .attr("y", (d) => y((next.get(d) || d).rank))
                .attr("width", (d) => x((next.get(d) || d).value) - x(0))
          )
          .call((bar) =>
            bar
              .transition(transition)
              .attr("y", (d) => y(d.rank))
              .attr("width", (d) => x(d.value) - x(0))
          ));
    }

    function labels(svg) {
      let label = svg
        .append("g")
        .style("font", "Pretendard-Bold")
        .style("font-size", barSize * 0.3)
        .attr("text-anchor", "end")
        .selectAll("text");

      return ([date, data], transition) =>
        (label = label
          .data(data.slice(0, n), (d) => d.name)
          .join(
            (enter) =>
              enter
                .append("text")
                .attr(
                  "transform",
                  (d) =>
                    `translate(${x((prev.get(d) || d).value)},${y(
                      (prev.get(d) || d).rank
                    )})`
                )
                .attr("y", y.bandwidth() / 2)
                .attr("x", -6)
                .attr("dy", "-0.25em")
                .text((d) => d.name)
                .call((text) =>
                  text
                    .append("tspan")
                    .attr("fill-opacity", 0.7)
                    .attr("font-weight", "normal")
                    .attr("x", -6)
                    .attr("dy", "1.15em")
                ),
            (update) => update,
            (exit) =>
              exit
                .transition(transition)
                .remove()
                .attr(
                  "transform",
                  (d) =>
                    `translate(${x((next.get(d) || d).value)},${y(
                      (next.get(d) || d).rank
                    )})`
                )
                .call((g) =>
                  g
                    .select("tspan")
                    .textTween((d) =>
                      d3.interpolateRound(d.value, (next.get(d) || d).value)
                    )
                )
          )
          .call((bar) =>
            bar
              .transition(transition)
              .attr("transform", (d) => `translate(${x(d.value)},${y(d.rank)})`)
              .call((g) =>
                g
                  .select("tspan")
                  .textTween(
                    (d) => (t) =>
                      formatNumber(
                        d3.interpolateNumber(
                          (prev.get(d) || d).value,
                          d.value
                        )(t)
                      )
                  )
              )
          ));
    }

    function axis(svg) {
      const g = svg.append("g").attr("transform", `translate(0,${margin.top})`);

      const axis = d3
        .axisTop(x)
        .ticks(width / 160)
        .tickSizeOuter(0)
        .tickSizeInner(-barSize * (n + y.padding()));

      return (_, transition) => {
        g.transition(transition).call(axis);
        g.select(".tick:first-of-type text").remove();
        g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
        g.select(".domain").remove();
      };
    }

    function ticker(svg) {
      const now = svg
        .append("text")
        .attr("text-anchor", "end")
        .style("font", "Pretendard-Bold")
        .style("font-size", 50)
        .attr("x", width - 6)
        .attr("y", margin.top + barSize * (n - 0.45))
        .attr("dy", "0.32em")
        .text(formatDate(keyframes[0][0]));

      return ([date], transition) => {
        transition.end().then(() => now.text(formatDate(date)));
      };
    }

    const formatDate = d3.utcFormat("%Y");
    const color = (() => {
      const scale = d3.scaleOrdinal(d3.schemeTableau10);
      if (data.some((d) => d.category !== undefined)) {
        const categoryByName = new Map(data.map((d) => [d.name, d.category]));
        scale.domain(Array.from(categoryByName.values()));
        return (d) => scale(categoryByName.get(d.name));
      }
      return (d) => scale(d.name);
    })();

    const margin = { top: 16, right: 6, bottom: 6, left: 0 };

    const parentWidth = containerRef.current?.clientWidth || 800;
    const parentHeight = containerRef.current?.clientHeight || 600;

    const height = parentHeight;
    const width = parentWidth;
    const barSize = (parentHeight - margin.top - margin.bottom) / n - 3;

    const x = d3.scaleLinear([0, 1], [margin.left, width - margin.right]);
    const y = d3
      .scaleBand()
      .domain(d3.range(n + 1))
      .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
      .padding(0.1);

    if (containerRef.current) containerRef.current.innerHTML = "";

    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);

    const updateBars = bars(svg);
    const updateAxis = axis(svg);
    const updateLabels = labels(svg);
    const updateTicker = ticker(svg);

    for (const keyframe of start ? keyframes.slice(0, 1) : keyframes) {
      const transition = svg
        .transition()
        .duration(duration)
        .ease(d3.easeLinear);

      // Extract the top bar’s value.
      x.domain([0, keyframe[1][0].value]);

      updateAxis(keyframe, transition);
      updateBars(keyframe, transition);
      updateLabels(keyframe, transition);
      updateTicker(keyframe, transition);

      await transition.end();
    }

    playing.current = false;
  };

  useOnRender(() => {
    render(true);
  });

  const unveil = useCallback(async () => {
    if (canGoDown) return goDown();
    if (playing.current) return;

    await render(false);
    setCanGoDown(true);
  }, []);

  return (
    <PageTemplate onWheelDown={canGoDown ? goDown : unveil} odd>
      <Flex flex={1} flexDirection={"column"} p={40}>
        <Flex flexDir={"column"} p={30}>
          <Text type="SemiBold" fontSize={42} color={COLORS.PURPLE}>
            지역별 신생아수 달리기!
          </Text>
          <Text type="Medium" fontSize={36} mb={30}>
            어떤 특징이 있나요?
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

export default BarRacePage;

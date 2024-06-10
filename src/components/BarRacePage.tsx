import { Flex } from "@chakra-ui/react";
import React, { useCallback, useRef, useState } from "react";
import { COLORS } from "../constants";
import { useScrollContext } from "../contexts/ScrollContext";
import PageTemplate from "./PageTemplate";
import Text from "./Text";

const BarRacePage = () => {
  const { goDown, lock } = useScrollContext();

  const [canGoDown, setCanGoDown] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const unveil = useCallback(() => {
    lock(10);
    videoRef.current?.play();
    setTimeout(() => {
      setCanGoDown(true);
    }, 3000);
  }, []);

  return (
    <PageTemplate onWheelDown={canGoDown ? goDown : unveil} odd>
      <Flex w="100%" h="100%" flexDirection={"column"} p={40}>
        <Flex flexDir={"column"} p={30}>
          <Text type="SemiBold" fontSize={42} color={COLORS.PURPLE}>
            지역별 신생아수 달리기!
          </Text>
          <Text type="Medium" fontSize={36} mb={30}>
            어떤 특징이 있나요?
          </Text>
          <video
            src={"/data/temp_run.mov"}
            width={"90%"}
            autoPlay
            ref={videoRef}
            autoFocus
            playsInline
            // controls
          />
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

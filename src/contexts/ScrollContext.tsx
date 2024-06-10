import React, { createContext, useCallback, useContext, useRef } from "react";

const ScrollContext = createContext<null | ScrollContextValue>(null);

const ScrollContextProvider = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentScrollIdx = useRef(0);
  const isScrolling = useRef(false);

  const timeoutRef = useRef<number>();

  const lock = useCallback((timeout: number) => {
    if (timeoutRef.current) return;

    isScrolling.current = true;
    setTimeout(() => {
      isScrolling.current = false;
    }, timeout);
  }, []);

  const scroll = useCallback((position: "up" | "down") => {
    console.log(isScrolling.current);
    if (isScrolling.current || !scrollRef.current) return;

    if (position === "up" && currentScrollIdx.current === 0) return;
    if (position === "down" && currentScrollIdx.current === 8) return;

    lock(2000);
    currentScrollIdx.current =
      position === "up"
        ? currentScrollIdx.current - 1
        : currentScrollIdx.current + 1;

    scrollRef.current.style.transform =
      "translateY(-" + currentScrollIdx.current * 100 + "vh)";
  }, []);

  const goUp = useCallback(() => scroll("up"), []);
  const goDown = useCallback(() => scroll("down"), []);

  return (
    <ScrollContext.Provider value={{ goDown, goUp, lock }}>
      <div
        ref={scrollRef}
        style={{
          transition: "1s cubic-bezier(0.5, 0, 0.5, 1)",
          position: "relative",
          overflow: "hidden",
          WebkitTransition: "1s cubic-bezier(0.5, 0, 0.5, 1)",
        }}
      >
        {children}
      </div>
    </ScrollContext.Provider>
  );
};

type ScrollContextValue = {
  goDown: () => void;
  goUp: () => void;
  lock: (timeout: number) => void;
};
export const useScrollContext = () => {
  const context = useContext(ScrollContext);

  if (!context) throw new Error();
  return context;
};

export default ScrollContextProvider;

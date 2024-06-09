import { EffectCallback, useEffect, useRef } from "react";

export const useOnRender = (effect: EffectCallback) => {
  const rendered = useRef(false);

  useEffect(() => {
    if (rendered.current) return;
    rendered.current = true;
    return effect();
  }, []);
};

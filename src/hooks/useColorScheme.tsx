import { Platform } from "@artiva/shared";
import { useEffect, useRef } from "react";
import { CustomPropertiesType } from "../../artiva.config";

const useColorScheme = ({ platform }: { platform: Platform }) => {
  const parentRef = useRef<HTMLDivElement>();
  const custom: CustomPropertiesType = platform.custom as any;

  useEffect(() => {
    if (!parentRef.current) return;
    if (
      custom.color_scheme === "Dark" ||
      (custom.color_scheme === "Auto" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      parentRef.current.classList.add("dark");
    } else {
      parentRef.current.classList.remove("dark");
    }
  }, [custom.color_scheme, parentRef]);

  return { parentRef };
};

export default useColorScheme;
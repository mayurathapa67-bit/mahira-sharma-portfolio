"use client";

import { useEffect, useRef } from "react";
import {
  useInView,
  useAnimation,
  type Variants,
  type UseInViewOptions,
} from "framer-motion";

export function useReveal(options?: UseInViewOptions) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, options ?? { once: true, margin: "-80px" });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      void controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      });
    }
  }, [inView, controls]);

  return { ref, controls };
}

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

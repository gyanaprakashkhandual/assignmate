/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function RouteProgressBase() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    let p = 0;
    setVisible(true);
    setProgress(0);
    timer.current = window.setInterval(() => {
      p += p < 60 ? 8 : p < 85 ? 2 : 0.5;
      setProgress(Math.min(p, 90));
    }, 200);
    if (timer.current !== null) {
      clearInterval(timer.current);
    }
    setProgress(100);
    setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 400);

    return () => {
      if (timer.current !== null) {
        clearInterval(timer.current);
      }
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 h-0.5 bg-black transition-[width] duration-200 ease-in-out z-9999"
      style={{ width: `${progress}%` }}
    />
  );
}

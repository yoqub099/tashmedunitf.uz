import { useEffect, useRef, useState, useCallback } from "react";

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [scrollY, setScrollY] = useState(0);
  const lastScrollYRef = useRef(0);
  const ticking = useRef(false);

  const updateScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const diff = currentScrollY - lastScrollYRef.current;

    if (Math.abs(diff) > 10) {
      setScrollDirection(diff > 0 ? "down" : "up");
      lastScrollYRef.current = currentScrollY > 0 ? currentScrollY : 0;
    }

    setScrollY(currentScrollY);
    ticking.current = false;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [updateScroll]);

  return { scrollDirection, scrollY };
}

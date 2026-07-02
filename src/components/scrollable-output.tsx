"use client";

import { ChevronDownIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const DEFAULT_MAX_HEIGHT = 260; // px


export const ScrollableOutput = ({
  children,
  maxHeight = DEFAULT_MAX_HEIGHT,
  fadeClassName = "from-muted/80",
}: {
  children: ReactNode;
  maxHeight?: number;
  /** Tailwind "from-*" class for the fade gradient; match your container's background. */
  fadeClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setIsScrollable(el.scrollHeight > el.clientHeight + 1);
    setAtTop(el.scrollTop < 4);
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 4);
  };

  useEffect(() => {
    checkScroll();
    const el = containerRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(el);
    window.addEventListener("resize", checkScroll);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", checkScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        onScroll={checkScroll}
        style={{ maxHeight }}
        className="overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/15 hover:[&::-webkit-scrollbar-thumb]:bg-foreground/30"
      >
        {children}
      </div>

      {isScrollable && !atTop && (
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b ${fadeClassName} to-transparent`}
        />
      )}

      {isScrollable && !atBottom && (
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 flex h-8 items-end justify-center bg-gradient-to-t ${fadeClassName} to-transparent pb-1`}
        >
          <ChevronDownIcon className="size-3.5 animate-bounce text-muted-foreground/70" />
        </div>
      )}
    </div>
  );
};

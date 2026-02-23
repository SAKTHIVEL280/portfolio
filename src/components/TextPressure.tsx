import { useRef, useEffect, useState } from "react";

interface TextPressureProps {
  text: string;
  className?: string;
  minWeight?: number;
  maxWeight?: number;
  minWidth?: number;
  maxWidth?: number;
}

const TextPressure = ({
  text,
  className = "",
  minWeight = 300,
  maxWeight = 700,
  minWidth = 75,
  maxWidth = 125,
}: TextPressureProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={containerRef} className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <PressureChar
          key={i}
          char={char}
          index={i}
          mouse={mouse}
          containerRef={containerRef}
          minWeight={minWeight}
          maxWeight={maxWeight}
          minWidth={minWidth}
          maxWidth={maxWidth}
        />
      ))}
    </div>
  );
};

const PressureChar = ({
  char,
  index,
  mouse,
  containerRef,
  minWeight,
  maxWeight,
  minWidth,
  maxWidth,
}: {
  char: string;
  index: number;
  mouse: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement>;
  minWeight: number;
  maxWeight: number;
  minWidth: number;
  maxWidth: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [style, setStyle] = useState({ fontWeight: minWeight, fontStretch: `${minWidth}%` });

  useEffect(() => {
    const el = ref.current;
    const container = containerRef.current;
    if (!el || !container) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 250;
    const proximity = Math.max(0, 1 - dist / maxDist);

    const weight = minWeight + (maxWeight - minWeight) * proximity;
    const width = minWidth + (maxWidth - minWidth) * proximity;

    setStyle({
      fontWeight: Math.round(weight),
      fontStretch: `${Math.round(width)}%`,
    });
  }, [mouse, minWeight, maxWeight, minWidth, maxWidth, containerRef]);

  return (
    <span
      ref={ref}
      style={{
        fontWeight: style.fontWeight,
        fontStretch: style.fontStretch,
        transition: "font-weight 0.15s ease, font-stretch 0.15s ease",
        display: "inline-block",
        fontVariationSettings: `'wght' ${style.fontWeight}`,
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  );
};

export default TextPressure;

import {
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
  type Ref,
} from "react";

type Props = {
  viewportRef: RefObject<HTMLDivElement | null>;
  pointX: number;
  pointY: number;
  setPointX: (v: number) => void;
  setPointY: (v: number) => void;
  applyZoom: (delta: number, cx: number, cy: number) => void;
  children: ReactNode;
};

export function MapViewport({
  viewportRef,
  pointX,
  pointY,
  setPointX,
  setPointY,
  applyZoom,
  children,
}: Props) {
  const isDragging = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);


  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("button, a, .map-controls")) return;
      isDragging.current = true;
      startXRef.current = e.clientX - pointX;
      startYRef.current = e.clientY - pointY;
      (e.currentTarget as HTMLDivElement).style.cursor = "grabbing";
    },
    [pointX, pointY],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      setPointX(e.clientX - startXRef.current);
      setPointY(e.clientY - startYRef.current);
    };
    const onUp = () => {
      isDragging.current = false;
      const el = viewportRef.current;
      if (el) el.style.cursor = "grab";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [setPointX, setPointY, viewportRef]);

  return (
    <div
      id="viewport"
      ref={viewportRef as Ref<HTMLDivElement>}
      onMouseDown={onMouseDown}
      style={{ cursor: "grab" }}
    >
      {children}
    </div>
  );
}

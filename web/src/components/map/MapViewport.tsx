import {
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
  type Ref,
} from "react";

/** Scroll-wheel zoom (fullscreen only). */
const WHEEL_ZOOM_SENSITIVITY = 0.001;
/** Trackpad pinch arrives as ctrl+wheel; higher than scroll for snappier zoom. */
const PINCH_WHEEL_SENSITIVITY = 0.007;
/** Two-finger touch pinch: scales the distance ratio into a zoom delta. */
const TOUCH_PINCH_SENSITIVITY = 3;

type Props = {
  viewportRef: RefObject<HTMLDivElement | null>;
  pointX: number;
  pointY: number;
  setPointX: (v: number) => void;
  setPointY: (v: number) => void;
  applyZoom: (delta: number, cx: number, cy: number) => void;
  wheelZoomEnabled?: boolean;
  children: ReactNode;
};

export function MapViewport({
  viewportRef,
  pointX,
  pointY,
  setPointX,
  setPointY,
  applyZoom,
  wheelZoomEnabled = false,
  children,
}: Props) {
  const isDragging = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const isInteractiveTarget = (target: EventTarget | null) =>
      target instanceof Element &&
      Boolean(target.closest("button, a, .map-controls"));

    const onWheel = (e: WheelEvent) => {
      const isTrackpadPinch = e.ctrlKey;
      if (!wheelZoomEnabled && !isTrackpadPinch) return;
      e.preventDefault();
      const sensitivity = isTrackpadPinch
        ? PINCH_WHEEL_SENSITIVITY
        : WHEEL_ZOOM_SENSITIVITY;
      const delta = -e.deltaY * sensitivity;
      const rect = el.getBoundingClientRect();
      applyZoom(delta, e.clientX - rect.left, e.clientY - rect.top);
    };

    let lastPinchDistance: number | null = null;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 2) {
        lastPinchDistance = null;
        return;
      }
      const [a, b] = [e.touches[0], e.touches[1]];
      lastPinchDistance = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || lastPinchDistance === null) return;
      if (isInteractiveTarget(e.target)) return;
      e.preventDefault();
      const [a, b] = [e.touches[0], e.touches[1]];
      const distance = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
      const rect = el.getBoundingClientRect();
      const cx = (a.clientX + b.clientX) / 2 - rect.left;
      const cy = (a.clientY + b.clientY) / 2 - rect.top;
      const ratio = distance / lastPinchDistance;
      const delta = (ratio - 1) * TOUCH_PINCH_SENSITIVITY;
      lastPinchDistance = distance;
      applyZoom(delta, cx, cy);
    };

    const onTouchEnd = () => {
      lastPinchDistance = null;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [applyZoom, viewportRef, wheelZoomEnabled]);

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

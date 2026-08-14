import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
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
const TAP_THRESHOLD = 8;

type Props = {
  viewportRef: RefObject<HTMLDivElement | null>;
  pointX: number;
  pointY: number;
  setPointX: (v: number) => void;
  setPointY: (v: number) => void;
  applyZoom: (delta: number, cx: number, cy: number) => void;
  wheelZoomEnabled?: boolean;
  onActivate?: () => void;
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
  onActivate,
  children,
}: Props) {
  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  });

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

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const target = event.target as HTMLElement;
      if (target.closest("button, a, .map-controls")) return;
      drag.current = {
        active: true,
        startX: event.clientX,
        startY: event.clientY,
        originX: pointX,
        originY: pointY,
        moved: false,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [pointX, pointY],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!drag.current.active) return;
      const dx = event.clientX - drag.current.startX;
      const dy = event.clientY - drag.current.startY;
      if (!drag.current.moved && Math.hypot(dx, dy) > TAP_THRESHOLD) {
        drag.current.moved = true;
      }
      if (!drag.current.moved) return;
      setPointX(drag.current.originX + dx);
      setPointY(drag.current.originY + dy);
    },
    [setPointX, setPointY],
  );

  const endPointer = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!drag.current.active) return;
      const wasTap = !drag.current.moved;
      drag.current.active = false;
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }
      if (wasTap) onActivate?.();
    },
    [onActivate],
  );

  return (
    <div
      id="viewport"
      ref={viewportRef as Ref<HTMLDivElement>}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      style={{ cursor: "grab" }}
    >
      {children}
    </div>
  );
}

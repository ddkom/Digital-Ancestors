import { useEffect, useRef, useState } from "react";
import { copy } from "../../locales";

/** "Answers are saved anonymously." + an "i" popover explaining what's kept. */
export function PrivacyNotice() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const text = copy.map.privacy;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="privacy-notice" ref={rootRef}>
      <span className="privacy-notice-text">{text.notice}</span>
      <button
        type="button"
        className="privacy-notice-btn"
        aria-expanded={open}
        aria-label={text.infoLabel}
        onClick={() => setOpen((o) => !o)}
      >
        i
      </button>
      {open ? (
        <div className="privacy-notice-popover" role="dialog" aria-label={text.infoLabel}>
          <p>
            <strong>{text.saveHeading}</strong> {text.save}
          </p>
          <p>
            <strong>{text.dontHeading}</strong> {text.dont}
          </p>
          <p>{text.why}</p>
        </div>
      ) : null}
    </div>
  );
}

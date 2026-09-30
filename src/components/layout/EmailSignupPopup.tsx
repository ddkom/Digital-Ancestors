import { useEffect, useRef, useState, type FormEvent } from "react";
import { siteConfig } from "../../config/site";
import { copy } from "../../locales";
import { looksLikeEmail, submitEmailSignup } from "../../lib/signup/submitEmailSignup";

const { enabled, delaySeconds, storageKey } = siteConfig.emailSignup;

type Status = "editing" | "sending" | "sent" | "error";

function hasSeen(): boolean {
  try {
    return window.localStorage.getItem(storageKey) !== null;
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    window.localStorage.setItem(storageKey, new Date().toISOString());
  } catch {
    // Storage blocked: the pop-up may show again next visit.
  }
}

/**
 * "Want to stay up to date?" email sign-up. Opens once per browser, a few seconds
 * after arriving on the page it's placed on (the guides page).
 */
export function EmailSignupPopup({ source }: { source: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const text = copy.emailSignup;
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("editing");

  useEffect(() => {
    if (!enabled || hasSeen()) return;
    const timer = window.setTimeout(() => {
      const dialog = dialogRef.current;
      // Don't stack on top of another pop-up (e.g. the event notice); try again next visit.
      if (!dialog || document.querySelector("dialog[open]")) return;
      markSeen();
      dialog.showModal();
    }, delaySeconds * 1000);
    return () => window.clearTimeout(timer);
  }, []);

  const close = () => dialogRef.current?.close();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!looksLikeEmail(email) || status === "sending") return;
    // Bots fill in the hidden field; pretend it worked and save nothing.
    if (honeypot) {
      setStatus("sent");
      return;
    }
    setStatus("sending");
    try {
      await submitEmailSignup(email, source, `${text.body} ${text.smallPrint}`);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="event-popup"
      aria-labelledby="email-signup-title"
      onClick={(e) => {
        // Clicking the dimmed backdrop closes it.
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="event-popup-inner">
        <button type="button" className="event-popup-close" aria-label={text.close} onClick={close}>
          ×
        </button>
        <h2 id="email-signup-title" className="event-popup-title">
          {status === "sent" ? text.thanksTitle : text.title}
        </h2>

        {status === "sent" ? (
          <>
            <p className="event-popup-text">{text.thanksBody}</p>
            <button type="button" className="btn btn-primary" onClick={close}>
              {text.done}
            </button>
          </>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <p className="event-popup-text">{text.body}</p>
            <label className="resource-field">
              <span className="resource-label">{text.emailLabel}</span>
              <input
                type="email"
                autoComplete="email"
                maxLength={254}
                placeholder={text.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            {/* Honeypot: hidden from people, tempting to bots. */}
            <label className="resource-honeypot" aria-hidden="true">
              Website
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </label>

            {status === "error" ? (
              <p className="resource-error" role="alert">
                {text.error}
              </p>
            ) : null}

            <div className="resource-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!looksLikeEmail(email) || status === "sending"}
              >
                {status === "sending" ? text.sending : text.submit}
              </button>
            </div>
            <p className="email-signup-small">{text.smallPrint}</p>
          </form>
        )}
      </div>
    </dialog>
  );
}

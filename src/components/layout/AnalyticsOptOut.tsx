import { useState } from "react";
import { copy } from "../../locales";
import { isOptedOut, optIn, optOut } from "../../lib/umami";

/** "Don't count me" switch, shown in the footer and the quiz's privacy popover. */
export function AnalyticsOptOut() {
  const [out, setOut] = useState(isOptedOut);
  const text = copy.analyticsOptOut;

  const toggle = () => {
    if (out) optIn();
    else optOut();
    setOut(!out);
  };

  return (
    <span className="analytics-opt-out">
      {out ? `${text.optedOut} ` : null}
      <button type="button" className="analytics-opt-out-btn" onClick={toggle}>
        {out ? text.undo : text.optOut}
      </button>
    </span>
  );
}

import { useState } from "react";
import DOMPurify from "dompurify";
import type { PathwayNode } from "../../types/pathway";

type Props = {
  node: PathwayNode;
  visible: boolean;
  isOptionSelected: (toId: string) => boolean;
  onToggleOption: (toId: string) => void;
};

/** Slight per-card rotation so the layout feels less grid-aligned. */
function nodeTiltDeg(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h % 11) - 5) * 0.22;
}

export function PathwayNodeCard({
  node,
  visible,
  isOptionSelected,
  onToggleOption,
}: Props) {
  const [contextOpen, setContextOpen] = useState(false);
  const resourceLabel = node.type === "end" ? "Open Resources" : "Resources";
  const toggleLabel = contextOpen ? "Hide Resources" : resourceLabel;

  return (
    <div
      id={node.id}
      className={`node ${node.type}${visible ? " visible" : ""}`.trim()}
      style={{
        left: node.x,
        top: node.y,
        ["--node-tilt" as string]: `${nodeTiltDeg(node.id)}deg`,
      }}
    >
      <div className="node-header">
        <span className="node-tag">{node.tag ?? "Step"}</span>
      </div>
      <div className="node-title">{node.title}</div>
      <div className="node-desc">{node.desc}</div>

      {node.context ? (
        <>
          <button
            type="button"
            className="context-toggle"
            onClick={() => setContextOpen((o) => !o)}
          >
            {toggleLabel}
          </button>
          <div
            className={`node-context${contextOpen ? " active" : ""}`.trim()}
            // sanitized HTML from trusted content file
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(node.context, {
                ADD_ATTR: ["target", "rel"],
              }),
            }}
          />
        </>
      ) : null}

      {node.options?.length ? (
        <div className="options">
          {node.options.map((opt) => {
            const tid = opt.target;
            if (!tid) return null;
            const selected = isOptionSelected(tid);
            return (
              <button
                key={`${node.id}-${opt.label}-${tid}`}
                type="button"
                className={`opt-btn${selected ? " selected" : ""}`.trim()}
                onClick={() => onToggleOption(tid)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

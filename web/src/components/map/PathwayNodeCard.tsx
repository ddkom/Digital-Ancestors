import { useState } from "react";
import { copy } from "../../locales";
import type { PathwayContextBlock, PathwayNode } from "../../types/pathway";

function normalizeContext(
  context: PathwayNode["context"],
): PathwayContextBlock[] {
  if (!context) return [];
  return Array.isArray(context) ? context : [context];
}

function ContextBlock({ block }: { block: PathwayContextBlock }) {
  return (
    <div className="context-block">
      <strong>{block["resource-type"]}:</strong>
      {block.notes ? <p className="context-notes">{block.notes}</p> : null}
      {block.resources?.length ? (
        <div className="context-resources">
          {block.resources.map((resource) => (
            <a
              key={resource.link}
              href={resource.link}
              className="resource-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              {resource.name}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

type Props = {
  node: PathwayNode;
  visible: boolean;
  isOptionSelected: (toId: string) => boolean;
  onToggleOption: (toId: string) => void;
};

export function PathwayNodeCard({
  node,
  visible,
  isOptionSelected,
  onToggleOption,
}: Props) {
  const [contextOpen, setContextOpen] = useState(false);
  const labels = copy.pathwayNodeCard;
  const resourceLabel =
    node.type === "end" ? labels.openResources : labels.resources;
  const toggleLabel = contextOpen ? labels.hideResources : resourceLabel;
  const contextBlocks = normalizeContext(node.context);

  return (
    <div
      id={node.id}
      className={`node-anchor ${node.type}${visible ? " visible" : ""}`.trim()}
      style={{ left: node.x, top: node.y }}
      {...(!visible ? { inert: true } : {})}
      aria-hidden={!visible}
    >
      <div className="node node-card">
        <div className="node-header">
          <span className="node-tag">{node.tag ?? labels.defaultTag}</span>
        </div>
        <div className="node-title">{node.title}</div>
        <div className="node-desc">{node.desc}</div>

        {contextBlocks.length ? (
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
            >
              {contextBlocks.map((block) => (
                <ContextBlock
                  key={block["resource-type"]}
                  block={block}
                />
              ))}
            </div>
          </>
        ) : null}

        {node.options?.length ? (
          <div className="node-edge-options" role="group" aria-label={node.title}>
            {node.options.map((opt) => {
              const tid = opt.target;
              if (!tid) return null;
              const selected = isOptionSelected(tid);
              return (
                <button
                  key={`${node.id}-${opt.label}-${tid}`}
                  type="button"
                  data-target={tid}
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
    </div>
  );
}

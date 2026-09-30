import type { RefObject } from "react";
import pathwayNodeDefs from "../../data/quizNodes.json";
import { characterById } from "../../data/characterProfiles";
import { copy } from "../../locales";
import type { PathwayNode, PathwayNodeDef } from "../../types/pathway";
import type { QuizResultState } from "../../hooks/useQuizTrail";
import { PathwayNodeCard } from "../map/PathwayNodeCard";

const resultDefs = pathwayNodeDefs as PathwayNodeDef[];

type Props = {
  result: QuizResultState | null;
  visible: boolean;
  resultRef: RefObject<HTMLElement>;
};

/**
 * The ancestor card. On desktop it sits on the map; on phones it sits below it.
 * The card itself is the same one the site has always used for results.
 */
export function QuizResult({ result, visible, resultRef }: Props) {
  if (!result) return null;
  const def = resultDefs.find((n) => n.id === `result_${result.position.character}`);
  if (!def) return null;
  const node: PathwayNode = { ...def, x: 0, y: 0 };
  const { closeCall } = copy.map.trail;
  const closeText = result.closeCall
    ? closeCall
        .replace("{a}", characterById(result.position.character).name)
        .replace("{b}", characterById(result.closeCall).name)
    : null;

  return (
    <aside
      ref={resultRef}
      className={`qm-result${visible ? " is-on" : ""}`}
      aria-live="polite"
    >
      <PathwayNodeCard
        node={node}
        visible
        isOptionSelected={() => false}
        onToggleOption={() => undefined}
      />
      {closeText ? <p className="qm-close">{closeText}</p> : null}
    </aside>
  );
}

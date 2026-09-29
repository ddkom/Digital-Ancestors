import { supabase } from "./supabaseClient";
import { isOptedOut } from "./umami";
import { QUIZ_BANK } from "./quiz/bank";
import type { QuizPosition, QuizScore } from "./quiz/engine";

/** Records one finished quiz anonymously. See docs/supabase-plan.md.
 * Skipped if the visitor opted out. Fails silently: analytics must never break the quiz. */
export async function saveQuizResponse(
  score: QuizScore,
  position: QuizPosition,
): Promise<void> {
  if (isOptedOut()) return;
  const row = {
    session_id: crypto.randomUUID(),
    x: position.x,
    y: position.y,
    character: position.character,
    question_count: score.answers.length,
  };
  // Which answer was picked for each question. The label is kept too, so rows
  // still make sense if questions are reworded or reordered later.
  const answers = score.answers.map((a) => ({
    question: a.questionId,
    answer: a.optionIndex,
    label: QUIZ_BANK.find((q) => q.id === a.questionId)?.options[a.optionIndex]?.label ?? null,
  }));
  try {
    let { error } = await supabase.from("quiz_responses").insert({ ...row, answers });
    // Until the `answers` column exists (docs/supabase-plan.md), still save the rest.
    if (error?.code === "PGRST204") {
      ({ error } = await supabase.from("quiz_responses").insert(row));
    }
    if (error) console.error("[analytics] quiz response not saved:", error);
  } catch (error) {
    console.error("[analytics] quiz response not saved:", error);
  }
}

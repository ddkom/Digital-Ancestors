import { supabase } from "./supabaseClient";
import type { QuizPosition, QuizScore } from "./quiz/engine";

/** Records one finished quiz anonymously. See docs/supabase-plan.md.
 * Fails silently: analytics must never break the quiz. */
export async function saveQuizResponse(
  score: QuizScore,
  position: QuizPosition,
): Promise<void> {
  try {
    const { error } = await supabase.from("quiz_responses").insert({
      session_id: crypto.randomUUID(),
      x: position.x,
      y: position.y,
      character: position.character,
      question_count: score.answers.length,
    });
    if (error) console.error("[analytics] quiz response not saved:", error);
  } catch (error) {
    console.error("[analytics] quiz response not saved:", error);
  }
}

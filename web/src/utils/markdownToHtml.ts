import { marked } from "marked";

marked.setOptions({ gfm: true });

export type PersonaSection = {
  key: "landscape" | "actionPlan" | "resources" | "regionalNotes" | "other";
  title: string;
  markdown: string;
};

export type PersonaMarkdown = {
  quote: string;
  lensTitle: string;
  lensMarkdown: string;
  details: PersonaSection[];
};

function sectionKey(title: string): PersonaSection["key"] | "lens" {
  const t = title.toLowerCase();
  if (t.includes("lens")) return "lens";
  if (t.includes("landscape")) return "landscape";
  if (t.includes("action")) return "actionPlan";
  if (t.includes("resource")) return "resources";
  if (t.includes("regional")) return "regionalNotes";
  return "other";
}

/** Split a persona markdown file into the lens card copy and expandable detail sections. */
export function splitPersonaMarkdown(markdown: string): PersonaMarkdown {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let quote = "";
  const sections: { title: string; lines: string[] }[] = [];
  let current: { title: string; lines: string[] } | null = null;

  for (const line of lines) {
    const heading3 = /^###\s+(.*)$/.exec(line);
    const heading2 = /^##\s+(.*)$/.exec(line);
    if (heading3) {
      if (current) sections.push(current);
      current = { title: heading3[1].trim(), lines: [] };
      continue;
    }
    if (!current && heading2) {
      quote = heading2[1].trim().replace(/^["“]|["”]$/g, "");
      continue;
    }
    if (current) current.lines.push(line);
  }
  if (current) sections.push(current);

  const lens = sections.find((section) => sectionKey(section.title) === "lens");
  const details = sections
    .filter((section) => sectionKey(section.title) !== "lens")
    .map((section) => ({
      key: sectionKey(section.title) as PersonaSection["key"],
      title: section.title,
      markdown: section.lines.join("\n").trim(),
    }))
    .filter((section) => section.markdown);

  return {
    quote,
    lensTitle: lens?.title ?? "Your lens",
    lensMarkdown: lens?.lines.join("\n").trim() ?? "",
    details,
  };
}

/** Render GFM markdown (headings, links, lists, tables, emphasis) to HTML. */
export function markdownToHtml(markdown: string): string {
  const html = marked.parse(markdown, { async: false }) as string;
  return html
    .replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ')
    .replace(/<table>/g, '<div class="character-table-wrap"><table>')
    .replace(/<\/table>/g, "</table></div>");
}

# Steward

## "AI for logistics, not my creative work."

### Your lens
You're the pragmatist. You didn't become an artist to spend Sunday nights on grant portals, chasing open calls, and rewriting the same bio in three lengths, so if a machine wants that job, fine. On your terms. You draw one bright line and hold it: AI in the back office, never in the artwork. The art stays yours, made by your hands, full stop.

which tools can you trust with your data, and whether a funder will care that you used one. You read the terms of service before you paste anything in. You know one unpublished proposal dropped into a free chatbot can cause problems later. So you keep a simple rule: nothing sensitive leaves the studio without knowing where it's going. Meanwhile your admin time keeps shrinking and your studio time keeps growing, and you're not mad about it.

### The landscape as you see it
- **Funders are on your side — with conditions.** The [Canada Council for the Arts](https://canadacouncil.ca/funding/resources/guidance-on-ai-in-grant-applications) explicitly permits AI for "administrative or supportive purposes" (outlines, grammar, plain language, translation) under its FASTER principles — while warning against entering sensitive or personal data into public tools and holding you fully accountable for accuracy and originality. [Arts Council England](https://www.artscouncil.org.uk/) permits cautious use in bids, confirms humans (never AI) assess applications, and internally green-lit only enterprise-licensed Copilot after reviewing tools' GDPR compliance. Their caution is worth hearing: AI-drafted applications trend homogeneous — don't let a model sand off the weirdness that makes your work fundable.
- **"Automation" doesn't mean drag-and-drop connectors anymore — it means an assistant that just does the thing.** The old model was stitching Zapier "if this, then that" recipes together by hand. In 2026 the leading tools are agents you hand a goal to and they carry it out across several steps on their own: [ChatGPT Agent](https://openai.com/) can browse, fill out forms, and file paperwork; [Gemini's agent mode](https://gemini.google.com/) has the deepest reach into Gmail and Google Workspace (drafting replies, summarizing threads); [Claude Cowork](https://claude.com/) is built specifically for this kind of non-coding knowledge work — research, document drafting, and multi-step admin, from a desktop app; [Microsoft Copilot Tasks](https://copilot.microsoft.com/) is the natural fit if your studio already runs on Word/Excel/Outlook. Zapier itself has shifted from a drag-and-drop builder into connector infrastructure that plugs any of the above agents into your other apps, so it hasn't disappeared — it's now the plumbing underneath the assistant, not the assistant itself. Treat any tool marketed as an "AI agent" skeptically until you've confirmed it can actually chain steps and recover from errors, rather than just auto-filling one field.
- **Privacy has a settings page, and it matters more with agents.** Once a tool can act on your behalf — reading your inbox, filling a form, browsing on your behalf — where your data goes matters even more than when it just answered questions. In ChatGPT and Claude: Settings → Data Controls → training toggle → off. Business/enterprise tiers (ChatGPT Business, Claude for Work, Copilot enterprise) contractually exclude your data from training, which is the level funders themselves are now using.
- **Local is still the gold standard for anything sensitive.** [Ollama](https://ollama.com/) (command line) and [LM Studio](https://lmstudio.ai/) (friendly GUI) run capable models entirely on your machine — zero cloud, zero training exposure, low energy. Current picks for an ordinary laptop: **Phi-4-mini** (3.8B) or **Gemma 3 4B** for general drafting; **Qwen3 8B** if you write in more than one language; **Gemma 3 12B** or **Mistral Small 3** if you have a bit more RAM to spare. A 4–8B model at Q4 quantization is a genuinely useful private admin assistant, and none of it phones home.
- **Browsers are becoming agents too.** Tools like [Perplexity Comet](https://www.perplexity.ai/comet) and similar browser-native agents can research open calls, compare grant requirements, or pull together a submissions list across many sites — worth trying for research-heavy admin, with the same review-everything caution as any agent.

### Your action plan

#### Quick wins
- Turn off training in every consumer AI tool you touch; write yourself a one-line studio policy: nothing unpublished, financial, or about other people goes into a public chatbot.
- Use AI for grant outlines, plain-language edits, and translation — disclose per each funder's rules, and rewrite until it sounds like you.
- Set [Google Alerts](https://www.google.com/alerts) for your name and project titles.

#### Medium effort
- Move sensitive drafting to a business/enterprise tier (ChatGPT Business / Claude for Work / Copilot enterprise) — the level funders themselves recommend.
- Pick one agent and hand it one real, recurring job: [Gemini](https://gemini.google.com/) or [Copilot Tasks](https://copilot.microsoft.com/) for inbox triage and scheduling if you're already in that ecosystem; [Claude Cowork](https://claude.com/) or [ChatGPT Agent](https://openai.com/) for research and multi-step admin (open-call roundups, application prep, deadline lists). Start read-only or draft-only until you trust it.

#### Deep engagement
- Stand up a fully local assistant: [LM Studio](https://lmstudio.ai/) + Phi-4-mini or Gemma 3 for private, zero-cloud drafting — the privacy-maximal *and* lowest-footprint option. If minimal-impact computing appeals to you as an ethic, not just a tactic, the [Permacomputing](https://permacomputing.net) community *(featured on [The AI Resist List](https://airesistlist.org/))* is your people.
- Consolidate your studio ops (contacts, applications, deadlines) in one system — e.g., [Notion](https://www.notion.com/) with its built-in AI kept on a leash — with clear rules about what data lives where, and let a connected agent read from it rather than pasting things in ad hoc.

### Key resources

| Resource | What it is | Stability |
|---|---|---|
| [Canada Council AI guidance](https://canadacouncil.ca/funding/resources/guidance-on-ai-in-grant-applications) | What funders allow (Canada) | Evergreen |
| [Arts Council England](https://www.artscouncil.org.uk/) AI position | What funders allow (UK) | Evergreen |
| [Claude Cowork](https://claude.com/) / [ChatGPT Agent](https://openai.com/) / [Gemini](https://gemini.google.com/) / [Copilot Tasks](https://copilot.microsoft.com/) | Multi-step AI agents for admin, research, and drafting | Fast-moving — capabilities shift monthly |
| [Ollama](https://ollama.com/) / [LM Studio](https://lmstudio.ai/) | Run private models locally | Evergreen platforms; model picks (Phi-4-mini, Gemma 3, Qwen3) date quickly |
| [Perplexity Comet](https://www.perplexity.ai/comet) | Browser-native research agent | Emerging — verify current name/version |
| [Google Alerts](https://www.google.com/alerts) | Free mention monitoring | Evergreen |
| [Permacomputing](https://permacomputing.net) | Low-impact computing community | Evergreen |

### Regional notes
- **Canada:** Canada Council's FASTER-based guidance is the reference point; you own every word you submit.
- **UK:** ACE permits cautious use; human-only assessment; enterprise tools favored; the [Digital Culture Network](https://digitalculturenetwork.org.uk/) offers free 1:1 tech support for artists.
- **US:** No blanket funder bans; disclosure norms are emerging — when in doubt, disclose.
- **EU:** GDPR shapes tool choice; prefer enterprise tiers or local models for anything involving personal data.

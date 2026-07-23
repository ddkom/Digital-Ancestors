# Trailblazer

## "The machine is a material."

### Your lens
You like trying new things and always have. You'd rather test a tool yourself and see what it can and can't do than read another opinion piece about it. But you're not careless about it. You know using AI can still cost people work or trust in some circles, and you want to be able to explain exactly how you made something if someone asks.

So you're careful about it. You pick models based on where their data came from, the same way you'd think about materials. You'd rather train on your own work than rely on something scraped from elsewhere. You label what you make and keep a record of your part in it, and you don't copy a living artist's style. You're trying to build the kind of practice you'd want to see more of: upfront about consent, clear about process, still recognizably yours. Artists like Holly Herndon and Mat Dryhurst, Refik Anadol, and Claire Silver show that being open about this can work.

### The landscape as you see it
- **Licensed-data models are real options now.** [Adobe Firefly](https://www.adobe.com/products/firefly.html) (Image Model 5) trains only on Adobe Stock, openly licensed, and public-domain content, with commercial indemnification — and now hosts partner models too. [Bria](https://bria.ai/) trains on 100% licensed data from 30+ partners (Getty, Envato, Alamy...) with an attribution engine that pays the source artists. [Fairly Trained](https://www.fairlytrained.org/) (Ed Newton-Rex) certifies models built on consented data. Spawning's public-domain dataset, PD12M (12.4M CC0/public-domain image-caption pairs), is available directly on [Hugging Face](https://huggingface.co/datasets/Spawning/PD12M) — note that Spawning's own front-end site (source.plus) has gone offline/lapsed, so the Hugging Face listing is currently the more reliable entry point.
- **Your own work is your best dataset.** LoRA training is more accessible than ever: locally via [Kohya_ss](https://github.com/bmaltais/kohya_ss) (v0.9+ runs FLUX training on as little as 8GB VRAM), [OneTrainer](https://github.com/Nerogar/OneTrainer), or [AI-Toolkit](https://github.com/ostris/ai-toolkit) (the go-to for FLUX.2); in the cloud via [fal.ai](https://fal.ai/) or [Replicate](https://replicate.com/). Base ecosystems: SDXL, SD 3.5, FLUX.1/FLUX.2. Note [Civitai](https://civitai.com/)'s ongoing payment/policy turbulence — treat it as a community hub, not critical infrastructure.
- **Copyright rewards your documentation.** The [US Copyright Office](https://www.copyright.gov/ai/) (Part 2, 2025) holds that prompts alone — however elaborate — earn no copyright, but your perceptible human expression, selection, arrangement, and modification do. Internationally it diverges: the UK is removing computer-generated-works protection, while some Chinese courts have granted copyright to AI-assisted works with sufficient human input. Your drafts, layers, and edit history are legal assets. Keep them.
- **Transparency is becoming law, not just etiquette.** [EU AI Act Article 50](https://artificialintelligenceact.eu/article/50/) requires machine-readable marking of AI-generated content from 2 August 2026 (it reaches anyone whose work touches EU audiences; penalties up to €15M/3% of turnover). Meta, TikTok, and YouTube already label. Get ahead of it: [Content Credentials](https://contentcredentials.org/) are embedded by default in Firefly and OpenAI outputs.
- **The style economy is emerging, but check who a tool is actually built for.** [Exactly.ai](https://exactly.ai/) still lets you train a private style model from your own images with commercial rights retained — worth a look — but its current case studies and pricing (per-download licensing, enterprise plans) have shifted toward brand/agency clients rather than individual illustrators; go in with that context. [Created by Humans](https://www.createdbyhumans.ai/) (with the Authors Guild) handles AI rights licensing for authors; Human Native's data marketplace was acquired by Cloudflare in January 2026 — consent-based licensing is becoming infrastructure, even if the artist-facing tools are still maturing.
- **The toolbox, currently:** image — Midjourney v7 (aesthetic leader; unindemnified and being sued by Disney/Universal/WBD), FLUX.2, Firefly Image 5, [Ideogram 3.0](https://ideogram.ai/) (text rendering), GPT Image; video — Sora 2, [Runway](https://runwayml.com/) Gen-4.5, Google Veo 3.1, Kling; music — Suno/Udio, now partly licensed after the UMG and Warner settlements (Sony's suit, with a pivotal fair-use ruling expected from the July 2026 hearing, is the one to watch).
- **Even in this lane, know what the other side of the argument looks like.** [The AI Resist List](https://airesistlist.org/) documents the case against large-scale generative AI in detail — data extraction, environmental cost, labor conditions behind the models. You don't have to agree with all of it to make better-informed choices about which tools you build with.

### Your action plan

#### Quick wins
- Default to licensed/indemnified models ([Firefly](https://www.adobe.com/products/firefly.html), [Bria](https://bria.ai/)) for client work; check [Fairly Trained's certified list](https://www.fairlytrained.org/certified-models) before adopting new tools.
- Label AI-assisted work everywhere, every time: #AIassisted, [Content Credentials](https://contentcredentials.org/), and the platform-native toggles — Instagram/Facebook's AI-content disclosure in advanced post settings, TikTok's manual AIGC toggle, YouTube's "Altered or synthetic content" checkbox in Studio at upload.
- Never prompt "in the style of [living artist]." Describe technique, era, mood, medium instead. This is the community's brightest line — honor it even where tools don't enforce it.

#### Medium effort
- Train a LoRA on your own work ([Kohya_ss](https://github.com/bmaltais/kohya_ss) or [AI-Toolkit](https://github.com/ostris/ai-toolkit) locally; [fal.ai](https://fal.ai/)/[Replicate](https://replicate.com/) in the cloud) — keep your style in your hands instead of surrendering it to scraped models.
- Build an authorship archive: prompts, drafts, layers, edit timeline. It's what makes your hybrid work registrable — and defensible.
- Register the human-authored elements of significant works with the [US Copyright Office](https://www.copyright.gov/ai/), disclosing AI-generated content per current guidance.

#### Deep engagement
- License your style on your terms via [Exactly.ai](https://exactly.ai/) or emerging marketplaces; pursue [Fairly Trained](https://www.fairlytrained.org/) certification if you ship a model or product.
- Prepare for [EU AI Act Article 50](https://artificialintelligenceact.eu/article/50/) labeling (August 2026) if your work reaches EU audiences.
- Work in the open — process posts, model cards for your LoRAs, honest credits — in the lineage of Holly Herndon & Mat Dryhurst (whose [Spawning](https://spawning.ai/) builds consent infrastructure), Refik Anadol, and Claire Silver. Transparency converts skeptics; secrecy confirms them.

### Key resources

| Resource | What it is | Stability |
|---|---|---|
| [Fairly Trained](https://www.fairlytrained.org/) | Consent-data certification + certified model list | Evergreen |
| [Adobe Firefly](https://www.adobe.com/products/firefly.html) (Image Model 5) | Licensed-data, indemnified generation | Versions move fast |
| [Bria](https://bria.ai/) | 100% licensed model + artist attribution/compensation | Evergreen |
| [Kohya_ss](https://github.com/bmaltais/kohya_ss) / [AI-Toolkit](https://github.com/ostris/ai-toolkit) / [fal.ai](https://fal.ai/) / [Replicate](https://replicate.com/) | Own-work LoRA training (local & cloud) | Tooling shifts monthly |
| [copyright.gov/ai](https://www.copyright.gov/ai/) | Human-authorship standard & registration guidance | Evergreen |
| [contentcredentials.org](https://contentcredentials.org/) | C2PA labeling + public verifier for your outputs | Evergreen — actively growing |
| [EU AI Act Article 50](https://artificialintelligenceact.eu/article/50/) | Transparency obligations (Aug 2026) | Evergreen reference |
| [Exactly.ai](https://exactly.ai/) | Train/license your own style | Active, but now positioned more toward brand/agency clients than individual artists — read the current pricing before assuming it's artist-first |
| [Created by Humans](https://www.createdbyhumans.ai/) | AI rights licensing (with Authors Guild) | Emerging — verify status |
| [PD12M on Hugging Face](https://huggingface.co/datasets/Spawning/PD12M) | Public-domain training dataset (Spawning) | Dataset itself is stable; Spawning's own site (source.plus) is currently down |

### Regional notes
- **US:** No copyright for pure AI output — document your human contribution; disclose AI content when registering.
- **UK/Canada:** Human authorship required; UK removing computer-generated-works protection entirely.
- **EU:** Article 50 labeling + GPAI transparency obligations from August 2026.
- **Global:** Jurisdictions genuinely diverge (some Chinese rulings grant copyright to AI-assisted work) — know the rules where you sell.

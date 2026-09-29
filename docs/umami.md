# Umami (visitor analytics)

Cookieless visitor stats. Code: [`src/lib/umami.ts`](../src/lib/umami.ts). Off until a website ID is set, and never counts `localhost`.

## What it tracks

| What | How |
| --- | --- |
| Visitors, page views, pages, referrers, country, device | Automatic |
| Where people leave the quiz | `quiz_question_shown` and `quiz_answered` events: `question`, `step` (never the answer) |
| Finished quizzes | `quiz_finished` event: `character`, `questions` |
| Opt-outs | `analytics_opt_out` event, sent once at the moment someone opts out (no other data) |

## Opting out

"Opt out of anonymous data collection" is in the footer and the quiz's "i" popover. It's remembered in that browser and stops both Umami and saving quiz answers to Supabase. Umami also skips browsers with Do Not Track on.

## Setup

1. Sign up at [cloud.umami.is](https://cloud.umami.is) with the shared Google account (free Hobby plan).
2. **Settings → Websites → Add website.** Enter the site's domain.
3. Copy the **Website ID** into `analytics.umamiWebsiteId` in [`src/config/site.ts`](../src/config/site.ts). It isn't secret.
4. Push to `main` on `ddkom` (deploys automatically) and visit the live site. You should appear under **Realtime**.

## Reading it

- **Traffic, pages, countries:** the website's dashboard.
- **Quiz and opt-out events:** **Events** tab. Filter by event name, then open its properties.
- **Which question people leave at:** **Events** tab → open `quiz_question_shown`, then `quiz_answered`, and compare the counts per `question`. Shown 200, answered 150 = 25% left at that question; a high number usually points to wording. Because questions adapt, compare by `question`, not `step`.

# Digital Ancestors

AI Pathways for Artists: an open decision-support tool for artists navigating AI choices around protection, administrative use, and co-creation.

## Docs

- [How the quiz works](docs/how-the-quiz-works.md)
- [Quiz responses in Supabase](docs/supabase-plan.md)
- [Resource suggestion form](docs/feedback-form-plan.md)
- [Visitor analytics with Umami](docs/umami.md)
- [Email sign-up](docs/email-signup.md)

## What we use

| | |
| --- | --- |
| App | [React 18](https://react.dev), [TypeScript](https://www.typescriptlang.org), [Vite](https://vitejs.dev), [React Router](https://reactrouter.com) |
| Background | [p5.js](https://p5js.org) shader (see Credits) |
| Guide content | Markdown in [`personas/`](personas/), rendered with [marked](https://marked.js.org) + [DOMPurify](https://github.com/cure53/DOMPurify) |
| QR codes | [react-qr-code](https://github.com/rosskhanas/react-qr-code) |
| Data | [Supabase](https://supabase.com): anonymous quiz results, resource suggestions, and opt-in email sign-ups |
| Visitor analytics | [Umami Cloud](https://umami.is), cookieless |
| Hosting | GitHub Pages, deployed by [GitHub Actions](.github/workflows/deploy-pages.yml) on every push to `main` |
| Settings | [`src/config/site.ts`](src/config/site.ts) (quiz length, event pop-up, analytics); copy in [`src/locales/en.json`](src/locales/en.json) |

## Run it

```bash
git clone git@github.com:ddkom/Digital-Ancestors.git
cd Digital-Ancestors
npm install
npm run dev
```

Add a `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (from Supabase → Project Settings → API). The live build reads the same two values from the repo's GitHub Actions secrets.

- `npm run build`: production build to `dist/`
- `npm run lint`: lint
- `npm run audit:quiz`: check the quiz doesn't favour a character
- `npm run validate:pathway`: check every pathway link points at a real node

## Deploying

Push to `main` on [`ddkom/Digital-Ancestors`](https://github.com/ddkom/Digital-Ancestors). GitHub Actions builds and publishes the site to GitHub Pages (progress in the repo's **Actions** tab).

## Legacy version

[`ai-framework-23.html`](ai-framework-23.html) is the original single-file app. Download it and open it on a desktop or laptop.

## Credits and license

Released under [CC0 1.0](LICENSE), **except** [`src/components/ShaderBackground.tsx`](src/components/ShaderBackground.tsx), adapted from ["procedural night reflections II"](https://openprocessing.org/sketch/623979) by [Pierre Marzin](https://openprocessing.org/user/19666) under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Our modified version is shared under the same license.

p5.js is LGPL-2.1.

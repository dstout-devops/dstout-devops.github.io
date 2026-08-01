# dstout-devops.github.io

Source for <https://dstout-devops.github.io>.

The site leads with why each project exists rather than what it is built from.
It is rendered to static HTML at build time and deployed by [a GitHub Actions
workflow](.github/workflows/deploy.yml).

## No framework

This was a React application. It shipped 64 kB of gzipped JavaScript so that a
browser could construct, on every visit, markup that never changes — for a page
whose argument is that the right move is to find the smaller problem, read by an
audience that opens dev tools.

So `src/render.js` builds the markup once, `npm run build` writes it to
`dist/index.html`, and the only script that survives is the eleven lines the
theme toggle actually needs. Sections fade in and out on scroll using CSS
scroll-driven animations, which run on the compositor; doing that in React would
mean scroll position becoming application state and a re-render every frame on
the main thread.

`animation-timeline` is not Baseline — Chrome and Edge 115+, Safari 26+, Firefox
Nightly only — so it sits behind `@supports`. Content is fully visible by
default and the animation only ever takes it away, which means a browser without
the feature loses the flourish and nothing else.

## Where the content comes from

`src/content.json` is not written by hand. It is emitted from a reviewed
evidence sheet that lives in a private repository, and only projects that clear
a publication gate reach it: public GitHub repositories, not confidential, and
explicitly opted in. Capability counts are derived by reading the repositories
themselves — a manifest, a config, a source file — never from a typed list.

Regenerate it with:

```
hunter portfolio --emit path/to/src/content.json
```

Editing `content.json` by hand defeats the gate. Change the evidence sheet and
re-emit.

## Local development

```
npm install
npm run dev     # build, serve on :5173, rebuild on change
npm run build
npm run check   # tsc --noEmit over the JSDoc types, then oxlint
```

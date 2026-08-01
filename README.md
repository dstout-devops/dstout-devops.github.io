# dstout-devops.github.io

Source for <https://dstout-devops.github.io>.

The site leads with why each project exists rather than what it is built from.
It is a static Vite/React build deployed by [a GitHub Actions
workflow](.github/workflows/deploy.yml).

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
npm run dev
npm run build
```

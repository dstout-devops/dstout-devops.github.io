/**
 * Build: render the page, compile the stylesheet, copy the static files.
 *
 * Deliberately not a bundler. There is nothing to bundle — one HTML file, one
 * stylesheet, and eleven lines of inline script.
 */

import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { render } from "../src/render.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "assets"), { recursive: true });

const content = JSON.parse(readFileSync(join(root, "src/content.json"), "utf8"));
writeFileSync(join(out, "index.html"), render(content));

const args = [
    "--input",
    join(root, "src/index.css"),
    "--output",
    join(out, "assets/site.css"),
    "--minify",
];
execFileSync(join(root, "node_modules/.bin/tailwindcss"), args, {
    stdio: "inherit",
    cwd: root,
});

cpSync(join(root, "public"), out, { recursive: true });

// Losing --input made Tailwind fall back to its own defaults: it reported
// success, wrote a plausible stylesheet, and silently dropped every rule in
// this repository. Nothing downstream noticed. Naming three rules that must
// survive turns that class of failure from invisible into loud.
const css = readFileSync(join(out, "assets/site.css"), "utf8");
for (const rule of [".ambient", ".scene", "@keyframes breathe", "--glow-magenta"]) {
    if (!css.includes(rule)) {
        throw new Error(`stylesheet built without ${rule} — check the tailwindcss arguments`);
    }
}

/** @param {string} path */
const kb = (path) => (readFileSync(join(out, path)).length / 1024).toFixed(1);

console.log(
    `built  index.html ${kb("index.html")} kB` +
    `  ·  site.css ${kb("assets/site.css")} kB` +
    `  ·  javascript shipped: 0 kB`,
);

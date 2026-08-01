/**
 * Local preview: build, serve, and rebuild whenever a source file changes.
 *
 * A dev server for a static site does not need module graphs or hot module
 * replacement — a rebuild takes a few hundred milliseconds, which is less
 * than the time it takes to move your hand back to the browser.
 */

import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { readFile, watch } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");
const port = Number(process.env.PORT ?? 5173);

/** @type {Record<string, string>} */
const TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
    ".json": "application/json",
};

const build = () => {
    try {
        execFileSync("node", [join(root, "scripts/build.js")], { stdio: "inherit" });
    } catch {
        console.error("build failed — leaving the last good output in place");
    }
};

build();

createServer(async (request, response) => {
    const path = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
    // normalize() collapses any ../ before it is joined, so a request cannot
    // walk out of dist and start serving the repository.
    const file = join(out, normalize(path).replace(/^(\.\.[/\\])+/, ""));
    const target = path.endsWith("/") ? join(file, "index.html") : file;
    try {
        const body = await readFile(target);
        response.writeHead(200, { "content-type": TYPES[extname(target)] ?? "application/octet-stream" });
        response.end(body);
    } catch {
        response.writeHead(404, { "content-type": "text/plain" }).end("not found");
    }
}).listen(port, () => console.log(`http://127.0.0.1:${port}`));

for (const directory of ["src", "public", "scripts"]) {
    (async () => {
        let pending = false;
        for await (const _ of watch(join(root, directory), { recursive: true })) {
            if (pending) continue;
            pending = true;
            setTimeout(() => {
                pending = false;
                build();
            }, 60);
        }
    })();
}

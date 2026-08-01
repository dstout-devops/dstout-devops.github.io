/**
 * The whole site, rendered once at build time.
 *
 * This was a React application. It shipped 64 KB of gzipped JavaScript so a
 * browser could construct, at runtime, markup that is identical on every
 * visit — for a page whose argument is that the right move is to find the
 * smaller problem. The audience for this page opens dev tools. So the markup
 * is now built here, once, and the only script that survives is the eleven
 * lines the theme toggle actually needs.
 *
 * Everything renders from content.json, which is emitted by hunter's
 * publication gate. Nothing in this file may add a fact; it may only arrange
 * the ones it is given.
 */

/** @import { Content, Project, Capability } from "./content.js" */

import { accentFor, ORDER_OF_LEVELS, readingOrder } from "./content.js";

/**
 * Escapes text for HTML. Every interpolation below goes through this, without
 * exception — the payload is trusted today because a gate produced it, and
 * "trusted input" is how injections arrive tomorrow.
 *
 * @param {string | number | undefined} value
 * @returns {string}
 */
const e = (value) =>
    String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

/** Capabilities found in fewer repositories than this are left off. */
const FLOOR = 3;

const STEPS = /** @type {const} */ ([
    ["problem", "The problem"],
    ["simplification", "The simplification"],
    ["scale", "Why it scales"],
]);

/**
 * @param {Project} project
 * @param {number} position
 * @returns {string}
 */
function caseStudy(project, position) {
    const accent = accentFor(project.slug);
    const steps = STEPS.map(
        ([key, label]) => `
          <section>
            <h4 class="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
              <span class="inline-block h-1.5 w-1.5 rounded-full" style="background:${accent}"></span>
              ${e(label)}
            </h4>
            <p class="text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">${e(project[key])}</p>
          </section>`,
    ).join("");

    const tech = project.tech
        .map(
            (name) =>
                `<li class="rounded-md bg-[color:var(--muted)] px-2 py-1 font-mono text-[11px] text-[color:var(--muted-foreground)]">${e(name)}</li>`,
        )
        .join("");

    return `
      <article id="${e(project.slug)}" class="scene scroll-mt-24 border-t py-16 first:border-t-0 sm:py-20">
        <header class="mb-10 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span class="font-mono text-xs tabular-nums" style="color:${accent}" aria-hidden="true">${String(position).padStart(2, "0")}</span>
          <h3 class="text-3xl font-bold tracking-tight sm:text-4xl">${e(project.name)}</h3>
          <a href="${e(project.link)}" target="_blank" rel="noreferrer noopener"
             class="ml-auto inline-flex min-h-6 items-center font-mono text-xs text-[color:var(--muted-foreground)] underline-offset-4 transition-colors hover:text-[color:var(--foreground)] hover:underline">
            source&nbsp;<span aria-hidden="true">↗</span>
          </a>
        </header>
        <div class="grid gap-8 sm:grid-cols-3">${steps}
        </div>
        <footer class="mt-10 border-t pt-6">
          <p class="mb-4 font-mono text-[13px] leading-relaxed text-[color:var(--muted-foreground)]">${e(project.summary)}</p>
          <ul class="flex flex-wrap gap-1.5">${tech}</ul>
        </footer>
      </article>`;
}

/**
 * Grouped by assessed level, then by count.
 *
 * Ranking on count alone put Docker, Shell and Testing at the top, because
 * that number measures how many repositories happen to contain a thing, which
 * is a proxy for how ordinary the thing is. It buried Go, Terraform and
 * TypeScript under Docker Compose. The judgement is the meaningful axis; the
 * count is the evidence behind it, and belongs second.
 *
 * @param {Capability[]} capabilities
 * @param {number} corpusSize
 * @returns {string}
 */
function capabilities(capabilities, corpusSize) {
    const kept = capabilities.filter((capability) => capability.repositories >= FLOOR);

    const groups = ORDER_OF_LEVELS.map((level) => {
        const members = kept
            .filter((capability) => capability.level === level)
            .sort((a, b) => b.repositories - a.repositories || a.name.localeCompare(b.name));
        if (members.length === 0) return "";
        const items = members
            .map(
                (capability) => `
            <li class="flex items-baseline justify-between gap-4 py-1.5">
              <span class="text-sm">${e(capability.name)}</span>
              <span class="shrink-0 font-mono text-xs tabular-nums text-[color:var(--muted-foreground)]">${capability.repositories}</span>
            </li>`,
            )
            .join("");
        return `
        <section>
          <h3 class="mb-4 border-b pb-2 text-xs font-semibold tracking-widest uppercase">${e(level)}</h3>
          <ul class="grid gap-x-10 sm:grid-cols-2">${items}
          </ul>
        </section>`;
    }).join("");

    return `
      <section id="capabilities" class="scene scroll-mt-24 border-t py-16 sm:py-20">
        <h2 class="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">What that adds up to</h2>
        <p class="mb-10 max-w-2xl text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
          None of this was typed into a list. It was found by reading ${corpusSize} repositories —
          manifests, configs, source files — and the number beside each one is how many of them
          contain evidence of it. Anything in fewer than ${FLOOR} is left off, because at that point
          it is usually a vendored file rather than something worked in. The grouping is my
          judgement and I should be able to defend it in a room; the count is just a fact.
        </p>
        <div class="space-y-12">${groups}
        </div>
      </section>`;
}

/**
 * @param {Content} content
 * @returns {string}
 */
export function render(content) {
    const { candidate, totals, generated_at } = content;
    const projects = readingOrder(content.projects);

    const links = Object.entries(candidate.links)
        .map(
            ([name, url]) =>
                `<a href="${e(url)}" target="_blank" rel="noreferrer noopener"
            class="inline-flex min-h-6 items-center text-[color:var(--primary)] underline-offset-4 hover:underline">${e(name)}</a>`,
        )
        .join("");

    // Only facts already visible on the page. Structured data that says more
    // than the page does is the same lie in a format machines believe.
    const structured = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: candidate.name,
        url: "https://dstout-devops.github.io/",
        ...(candidate.headline ? { description: candidate.headline } : {}),
        sameAs: Object.values(candidate.links),
    };

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${e(candidate.name)} — platform engineering</title>
    <meta name="description" content="${e(candidate.headline || "Most complexity is misunderstanding wearing a costume.")}" />
    <link rel="canonical" href="https://dstout-devops.github.io/" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://dstout-devops.github.io/" />
    <meta property="og:title" content="${e(candidate.name)} — platform engineering" />
    <meta property="og:description" content="Most complexity is misunderstanding wearing a costume." />
    <meta name="twitter:card" content="summary" />
    <meta name="color-scheme" content="light dark" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="/assets/site.css" />
    <script type="application/ld+json">${JSON.stringify(structured)}</script>
    <script>
      // Inline and before first paint, so a dark-theme visitor never sees a
      // white flash. This is the entire runtime of the site.
      (() => {
        const saved = localStorage.getItem("theme");
        const dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.classList.toggle("dark", dark);
      })();
    </script>
  </head>
  <body>
    <div class="ambient" aria-hidden="true">
      <span class="glow glow-magenta"></span>
      <span class="glow glow-cyan"></span>
      <span class="glow glow-green"></span>
      <span class="glow glow-violet"></span>
    </div>

    <div class="mx-auto min-h-dvh max-w-3xl px-6 sm:px-8">
      <a href="#work" class="sr-only focus:not-sr-only focus:absolute focus:m-4 focus:rounded-lg focus:border focus:bg-[color:var(--background)] focus:px-4 focus:py-2">Skip to the work</a>

      <header class="flex items-center justify-between py-8">
        <span class="font-mono text-sm">${e(candidate.name)}</span>
        <button id="theme" type="button" aria-label="Switch colour theme"
                class="rounded-lg border p-2 text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        </button>
      </header>

      <section class="py-12 sm:py-20">
        ${candidate.headline ? `<p class="mb-5 max-w-xl text-sm font-medium text-[color:var(--primary)] sm:text-base">${e(candidate.headline)}</p>` : ""}
        <h1 class="max-w-[19ch] text-[2rem] leading-[1.06] font-extrabold tracking-[-0.02em] text-balance sm:text-[3.25rem]">
          Understanding is the work.
        </h1>
        <div class="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-[color:var(--muted-foreground)] sm:text-lg">
          <p>
            Most complexity is misunderstanding wearing a costume. When a system can only be
            described in its own jargon, that is rarely because the domain is genuinely hard. It is
            because nobody has worked out yet what the actual problem is, and a pile of workarounds
            is standing in for the answer.
          </p>
          <figure class="border-l-2 border-[color:var(--primary)] pl-5">
            <blockquote class="text-[color:var(--foreground)]">
              It can scarcely be denied that the supreme goal of all theory is to make the
              irreducible basic elements as simple and as few as possible
              <em class="not-italic underline decoration-[color:var(--primary)] decoration-2 underline-offset-4">
                without having to surrender the adequate representation of a single datum of
                experience</em>.
            </blockquote>
            <figcaption class="mt-3 font-mono text-xs">
              Albert Einstein, <cite class="not-italic">On the Method of Theoretical Physics</cite>,
              the Herbert Spencer Lecture, Oxford, 10 June 1933
            </figcaption>
          </figure>
          <p>
            The underlined half is the whole discipline, and it is the half that gets dropped.
            Anyone can make a system simpler by ignoring the cases that are inconvenient. That is
            not simplification, it is deferral — the ignored case comes back as an exception, then
            as a workaround, then as a runbook, and eventually as the reason nobody can explain how
            any of it works. The bar is the fewest parts that still represent every real case.
          </p>
          <p>
            So the first job never changes: find the real problem, name it in plain language, and
            check the explanation survives contact with someone outside the team. If it cannot be
            said simply it is not understood yet, and anything built before that point is an
            expensive way to be wrong. That matters more now, not less. When writing the code stops
            being the constraint, the constraint becomes knowing which code is worth writing.
            Nobody is short of output any more; what is scarce is someone who can look at a tangle
            and say what it is actually made of.
          </p>
          <p>
            Below are ${totals.public_projects} projects, each led by why it exists rather than what
            it is built from. The code is one click away if you want it.
          </p>
        </div>
        <nav class="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-sm">
          ${links}
          ${candidate.based ? `<span class="text-[color:var(--muted-foreground)]">${e(candidate.based)}</span>` : ""}
        </nav>
      </section>

      <main id="work" class="scroll-mt-8">
        <h2 class="sr-only">Case studies</h2>${projects.map((project, i) => caseStudy(project, i + 1)).join("")}
${capabilities(content.capabilities, totals.repositories)}
      </main>

      <footer class="border-t py-10 font-mono text-xs text-[color:var(--muted-foreground)]">
        <p>
          Assembled from a reviewed evidence sheet on
          <time datetime="${e(generated_at)}">${e(generated_at.slice(0, 10))}</time>.
          Public repositories only.
        </p>
      </footer>
    </div>

    <script>
      document.getElementById("theme").addEventListener("click", () => {
        const root = document.documentElement;
        // Suppress transitions for one frame, or every colour eases at once
        // and the flip reads as a smear.
        root.classList.add("no-transitions");
        const dark = root.classList.toggle("dark");
        localStorage.setItem("theme", dark ? "dark" : "light");
        requestAnimationFrame(() => root.classList.remove("no-transitions"));
      });
    </script>
  </body>
</html>
`;
}

import { Capabilities } from "./components/Capabilities";
import { CaseStudy } from "./components/CaseStudy";
import { ThemeToggle } from "./components/ThemeToggle";
import { content, projects } from "./content";

export default function App() {
  const { candidate, totals, generated_at } = content;

  return (
    <div className="mx-auto min-h-dvh max-w-3xl px-6 sm:px-8">
      <div className="ambient" aria-hidden="true" />
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:absolute focus:m-4 focus:rounded-lg focus:border focus:bg-[color:var(--background)] focus:px-4 focus:py-2"
      >
        Skip to the work
      </a>

      <header className="flex items-center justify-between py-8">
        <span className="font-mono text-sm">{candidate.name}</span>
        <ThemeToggle />
      </header>

      <section className="py-12 sm:py-20">
        <h1 className="max-w-[19ch] text-[2rem] leading-[1.06] font-extrabold tracking-[-0.02em] text-balance sm:text-[3.25rem]">
          The work is finding the smaller problem.
        </h1>
        <div className="mt-8 max-w-2xl space-y-4 text-base leading-relaxed text-[color:var(--muted-foreground)] sm:text-lg">
          <p>
            Anyone can add another integration. The harder and more valuable move is noticing that
            the integration should not have been necessary — that the thing being solved by hand,
            over and over, has one shape underneath it, and that shape can be named once.
          </p>
          <p>
            Below are {totals.public_projects} projects, each led by why it exists rather than what
            it is built from. The code is one click away if you want it.
          </p>
        </div>
        <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
          {Object.entries(candidate.links).map(([name, url]) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[color:var(--primary)] underline-offset-4 hover:underline"
            >
              {name}
            </a>
          ))}
        </nav>
      </section>

      <main id="work" className="scroll-mt-8">
        <h2 className="sr-only">Case studies</h2>
        {projects.map((project, index) => (
          <CaseStudy key={project.slug} project={project} index={index} />
        ))}
        <Capabilities />
      </main>

      <footer className="border-t py-10 font-mono text-xs text-[color:var(--muted-foreground)]">
        <p>
          Assembled from a reviewed evidence sheet on{" "}
          <time dateTime={generated_at}>{generated_at.slice(0, 10)}</time>. Public repositories
          only.
        </p>
      </footer>
    </div>
  );
}

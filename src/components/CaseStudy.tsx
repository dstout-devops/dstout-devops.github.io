import { accentFor, type Project } from "../content";

const STEPS = [
    { key: "problem", label: "The problem" },
    { key: "simplification", label: "The simplification" },
    { key: "scale", label: "Why it scales" },
] as const;

export function CaseStudy({ project, index }: { project: Project; index: number }) {
    const accent = accentFor(project.slug);

    return (
        <article id={project.slug} className="scroll-mt-24 border-t py-16 first:border-t-0 sm:py-20">
            <header className="mb-10 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <span
                    className="font-mono text-xs tabular-nums"
                    style={{ color: accent }}
                    aria-hidden="true"
                >
                    {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">{project.name}</h3>
                <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="ml-auto font-mono text-xs text-[color:var(--muted-foreground)] underline-offset-4 transition-colors hover:text-[color:var(--foreground)] hover:underline"
                >
                    source ↗
                </a>
            </header>

            <div className="grid gap-8 sm:grid-cols-3">
                {STEPS.map(({ key, label }) => (
                    <section key={key}>
                        <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
                            <span
                                className="inline-block h-1.5 w-1.5 rounded-full"
                                style={{ background: accent }}
                                aria-hidden="true"
                            />
                            {label}
                        </h4>
                        <p className="text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
                            {project[key]}
                        </p>
                    </section>
                ))}
            </div>

            <footer className="mt-10 border-t pt-6">
                <p className="mb-4 font-mono text-[13px] leading-relaxed text-[color:var(--muted-foreground)]">
                    {project.summary}
                </p>
                <ul className="flex flex-wrap gap-1.5">
                    {project.tech.map((tech) => (
                        <li
                            key={tech}
                            className="rounded-md bg-[color:var(--muted)] px-2 py-1 font-mono text-[11px] text-[color:var(--muted-foreground)]"
                        >
                            {tech}
                        </li>
                    ))}
                </ul>
            </footer>
        </article>
    );
}

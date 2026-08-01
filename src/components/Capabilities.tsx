import { content } from "../content";

/* Detection is per-repository, so anything appearing once is usually a
   vendored file or a template the language classifier caught rather than
   something worked in. Publishing that tail turns this section into an
   inventory, which is the opposite of the point. */
const FLOOR = 3;

export function Capabilities() {
    const ranked = content.capabilities
        .filter((capability) => capability.repositories >= FLOOR)
        .sort((a, b) => b.repositories - a.repositories || a.name.localeCompare(b.name));

    const widest = ranked[0]?.repositories ?? 1;

    return (
        <section id="capabilities" className="scroll-mt-24 border-t py-16 sm:py-20">
            <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">What that adds up to</h2>
            <p className="mb-10 max-w-2xl text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
                None of this was typed into a list. It was found by reading{" "}
                {content.totals.repositories} repositories — manifests, configs, source files — and the
                number is how many of them contain evidence of it. Anything appearing in fewer than {FLOOR}{" "}
                is left off, because at that point it is usually a vendored file rather than something
                worked in. The count is a fact; the word beside it is a judgement I should be able to
                defend in a room.
            </p>

            <ul className="grid gap-x-10 gap-y-px sm:grid-cols-2">
                {ranked.map((capability) => (
                    <li key={capability.name} className="py-2">
                        <div className="flex items-baseline justify-between gap-4">
                            <span className="text-sm font-medium">{capability.name}</span>
                            <span className="shrink-0 font-mono text-xs text-[color:var(--muted-foreground)]">
                                <span className="tabular-nums">{capability.repositories}</span>
                                {capability.level && (
                                    <span className="ml-2 hidden sm:inline">{capability.level}</span>
                                )}
                            </span>
                        </div>
                        <div
                            className="mt-1.5 h-px bg-[color:var(--primary)] opacity-40"
                            style={{ width: `${Math.max(4, (capability.repositories / widest) * 100)}%` }}
                            aria-hidden="true"
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
}

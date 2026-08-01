import payload from "./content.json";

export type Project = {
    slug: string;
    name: string;
    link: string;
    problem: string;
    simplification: string;
    scale: string;
    summary: string;
    tech: string[];
};

export type Capability = {
    name: string;
    level: string;
    repositories: number;
};

export type Content = {
    candidate: { name: string; links: Record<string, string> };
    projects: Project[];
    capabilities: Capability[];
    totals: { capabilities: number; public_projects: number; repositories: number };
    generated_at: string;
};

export const content = payload as Content;

/* Newest and broadest first, then the narrower work it grew out of. The
   payload is emitted alphabetically because that is the only order a
   machine can defend; this is the order a reader wants. */
const READING_ORDER = ["stratt", "service-nebula", "pulsar", "forge-of-prospects"];

export const projects = [...content.projects].sort(
    (a, b) => READING_ORDER.indexOf(a.slug) - READING_ORDER.indexOf(b.slug),
);

export const ACCENTS: Record<string, string> = {
    stratt: "var(--accent-estate)",
    "service-nebula": "var(--accent-cluster)",
    pulsar: "var(--accent-answer)",
    "forge-of-prospects": "var(--accent-coach)",
};

export const accentFor = (slug: string) => ACCENTS[slug] ?? "var(--primary)";

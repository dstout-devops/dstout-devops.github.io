/**
 * The shape of what the publication gate emits, and the two orderings the
 * site imposes on it.
 *
 * @typedef {object} Project
 * @property {string} slug
 * @property {string} name
 * @property {string} link
 * @property {string} problem
 * @property {string} simplification
 * @property {string} scale
 * @property {string} summary
 * @property {string[]} tech
 *
 * @typedef {object} Capability
 * @property {string} name
 * @property {string} level
 * @property {number} repositories
 *
 * @typedef {object} Candidate
 * @property {string} name
 * @property {string} headline
 * @property {string} based
 * @property {Record<string, string>} links
 *
 * @typedef {object} Content
 * @property {Candidate} candidate
 * @property {Project[]} projects
 * @property {Capability[]} capabilities
 * @property {{ capabilities: number, public_projects: number, repositories: number }} totals
 * @property {string} generated_at
 */

/** Deepest assessment first. */
export const ORDER_OF_LEVELS = ["proficient", "working", "familiar"];

/**
 * Newest and broadest first, then the narrower work it grew out of. The
 * payload is alphabetical because that is the only order a machine can
 * defend; this is the order a reader wants. Anything unlisted sorts last
 * rather than vanishing, so adding a project cannot silently drop it.
 */
const READING_ORDER = ["stratt", "service-nebula", "pulsar", "forge-of-prospects"];

/**
 * @param {Project[]} projects
 * @returns {Project[]}
 */
export function readingOrder(projects) {
    const rank = (/** @type {Project} */ project) => {
        const at = READING_ORDER.indexOf(project.slug);
        return at === -1 ? READING_ORDER.length : at;
    };
    return [...projects].sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
}

/** @type {Record<string, string>} */
const ACCENTS = {
    stratt: "var(--accent-estate)",
    "service-nebula": "var(--accent-cluster)",
    pulsar: "var(--accent-answer)",
    "forge-of-prospects": "var(--accent-coach)",
};

/**
 * @param {string} slug
 * @returns {string}
 */
export const accentFor = (slug) => ACCENTS[slug] ?? "var(--primary)";

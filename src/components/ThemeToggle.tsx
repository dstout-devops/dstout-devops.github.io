import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const stored = (): Theme | null => {
    const value = localStorage.getItem("theme");
    return value === "light" || value === "dark" ? value : null;
};

const preferred = (): Theme =>
    stored() ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>(preferred);

    useEffect(() => {
        const root = document.documentElement;
        // Every colour on the page would otherwise ease at once, which reads as
        // a smear. Suppress transitions for one frame so the flip is instant.
        root.classList.add("no-transitions");
        root.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
        const frame = requestAnimationFrame(() => root.classList.remove("no-transitions"));
        return () => cancelAnimationFrame(frame);
    }, [theme]);

    return (
        <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="rounded-lg border p-2 text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)]"
        >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
    );
}

const iconProps = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
};

const SunIcon = () => (
    <svg {...iconProps}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
);

const MoonIcon = () => (
    <svg {...iconProps}>
        <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
    </svg>
);

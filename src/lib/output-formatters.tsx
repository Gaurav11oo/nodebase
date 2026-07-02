import { Fragment, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Node naming + visuals (logo lookup against /public/logos)
// ---------------------------------------------------------------------------

/** Turn a node key like "Gemini_AI" or "httpRequest" into "Gemini AI" / "Http Request" */
export const formatNodeName = (key: string) => {
  const spaced = key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
  return spaced
    .split(" ")
    .map((word) =>
      word.length <= 3 && word === word.toUpperCase()
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

export type NodeVisual = { logo: string; accent: string; ring: string };

// Logo files available under /public/logos — matched against the node/provider name.
// Order matters: more specific names should be checked before generic ones.
const LOGO_RULES: {
  match: string[];
  file: string;
  accent: string;
  ring: string;
}[] = [
  {
    match: ["gemini", "google-ai", "googleai"],
    file: "gemini",
    accent: "bg-blue-50",
    ring: "ring-blue-100",
  },
  {
    match: ["googleform", "google_form", "form"],
    file: "googleform",
    accent: "bg-purple-50",
    ring: "ring-purple-100",
  },
  {
    match: ["google"],
    file: "google",
    accent: "bg-blue-50",
    ring: "ring-blue-100",
  },
  {
    match: ["gpt", "openai"],
    file: "openai",
    accent: "bg-emerald-50",
    ring: "ring-emerald-100",
  },
  {
    match: ["claude", "anthropic"],
    file: "anthropic",
    accent: "bg-orange-50",
    ring: "ring-orange-100",
  },
  {
    match: ["github"],
    file: "github",
    accent: "bg-slate-50",
    ring: "ring-slate-200",
  },
  {
    match: ["discord"],
    file: "discord",
    accent: "bg-indigo-50",
    ring: "ring-indigo-100",
  },
  {
    match: ["slack"],
    file: "slack",
    accent: "bg-fuchsia-50",
    ring: "ring-fuchsia-100",
  },
  {
    match: ["stripe"],
    file: "stripe",
    accent: "bg-violet-50",
    ring: "ring-violet-100",
  },
  {
    match: ["vercel"],
    file: "vercel",
    accent: "bg-neutral-50",
    ring: "ring-neutral-200",
  },
  {
    match: ["next"],
    file: "next",
    accent: "bg-neutral-50",
    ring: "ring-neutral-200",
  },
  {
    match: ["file"],
    file: "file",
    accent: "bg-amber-50",
    ring: "ring-amber-100",
  },
  {
    match: ["http", "webhook", "url", "globe", "web"],
    file: "globe",
    accent: "bg-cyan-50",
    ring: "ring-cyan-100",
  },
];

/** Pick a real /logos/*.svg icon + accent color based on the node/provider name. */
export const getNodeVisual = (key: string): NodeVisual => {
  const lower = key.toLowerCase();
  const rule = LOGO_RULES.find((r) => r.match.some((m) => lower.includes(m)));
  if (rule) {
    return {
      logo: `/logos/${rule.file}.svg`,
      accent: rule.accent,
      ring: rule.ring,
    };
  }
  return { logo: "/logos/logo.svg", accent: "bg-muted", ring: "ring-border" };
};

// ---------------------------------------------------------------------------
// Lightweight markdown rendering (bold / code / italic / headings / lists)
// ---------------------------------------------------------------------------

/** Render **bold**, `code`, and *italic* inline markdown as JSX. */
export const renderInline = (text: string): ReactNode => {
  const parts = text.split(/(\*\*.+?\*\*|`.+?`|\*.+?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-foreground/10 px-1 py-0.5 font-mono text-[0.8em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={i} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
};

/** Turn a lightweight-markdown string (paragraphs, lists, headings) into JSX blocks. */
export const renderMarkdownBlock = (text: string) => {
  const lines = text.split("\n");
  const elements: ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul
          key={`list-${elements.length}`}
          className="my-1.5 list-disc space-y-1 pl-5"
        >
          {listItems.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      return;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      listItems.push(line.slice(2));
      return;
    }
    if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h4 key={idx} className="mt-3 text-sm font-semibold text-foreground">
          {renderInline(line.slice(4))}
        </h4>
      );
      return;
    }
    if (line.startsWith("## ") || line.startsWith("# ")) {
      flushList();
      const content = line.replace(/^##?\s/, "");
      elements.push(
        <h3 key={idx} className="mt-3 text-base font-semibold text-foreground">
          {renderInline(content)}
        </h3>
      );
      return;
    }
    flushList();
    elements.push(
      <p key={idx} className="text-sm leading-relaxed text-foreground/90">
        {renderInline(line)}
      </p>
    );
  });

  flushList();
  return elements;
};

// ---------------------------------------------------------------------------
// JSON syntax highlighting
// ---------------------------------------------------------------------------

/** Colorized, indented JSON for anything that isn't plain prose. */
export const syntaxHighlightJson = (value: unknown) => {
  const json = JSON.stringify(value, null, 2);
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "text-amber-600 dark:text-amber-400"; // number
      if (/^"/.test(match)) {
        cls = /:$/.test(match)
          ? "text-violet-600 dark:text-violet-400"
          : "text-emerald-600 dark:text-emerald-400";
      } else if (/true|false/.test(match)) {
        cls = "text-blue-600 dark:text-blue-400";
      } else if (/null/.test(match)) {
        cls = "text-rose-500 dark:text-rose-400";
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
};

// ---------------------------------------------------------------------------
// Length heuristics (used to decide when to switch on the scroll effect)
// ---------------------------------------------------------------------------

/** Rough estimate of how many visual lines a block of text will wrap to. */
export const estimateLineCount = (text: string, charsPerLine = 90) =>
  text
    .split("\n")
    .reduce(
      (total, line) =>
        total + Math.max(1, Math.ceil(line.length / charsPerLine)),
      0
    );

// import { Fragment, type ReactNode } from "react";

// // ---------------------------------------------------------------------------
// // Node naming + visuals (logo lookup against /public/logos)
// // ---------------------------------------------------------------------------

// /** Turn a node key like "Gemini_AI" or "httpRequest" into "Gemini AI" / "Http Request" */
// export const formatNodeName = (key: string) => {
//   const spaced = key
//     .replace(/_/g, " ")
//     .replace(/([a-z])([A-Z])/g, "$1 $2")
//     .trim();
//   return spaced
//     .split(" ")
//     .map((word) =>
//       word.length <= 3 && word === word.toUpperCase()
//         ? word
//         : word.charAt(0).toUpperCase() + word.slice(1)
//     )
//     .join(" ");
// };

// export type NodeVisual = { logo: string; accent: string; ring: string };

// // Logo files available under /public/logos — matched against the node/provider name.
// // Order matters: more specific names should be checked before generic ones.
// const LOGO_RULES: {
//   match: string[];
//   file: string;
//   accent: string;
//   ring: string;
// }[] = [
//   {
//     match: ["gemini", "google-ai", "googleai"],
//     file: "gemini",
//     accent: "bg-blue-50",
//     ring: "ring-blue-100",
//   },
//   {
//     match: ["googleform", "google_form", "form"],
//     file: "googleform",
//     accent: "bg-purple-50",
//     ring: "ring-purple-100",
//   },
//   {
//     match: ["google"],
//     file: "google",
//     accent: "bg-blue-50",
//     ring: "ring-blue-100",
//   },
//   {
//     match: ["gpt", "openai"],
//     file: "openai",
//     accent: "bg-emerald-50",
//     ring: "ring-emerald-100",
//   },
//   {
//     match: ["claude", "anthropic"],
//     file: "anthropic",
//     accent: "bg-orange-50",
//     ring: "ring-orange-100",
//   },
//   {
//     match: ["github"],
//     file: "github",
//     accent: "bg-slate-50",
//     ring: "ring-slate-200",
//   },
//   {
//     match: ["discord"],
//     file: "discord",
//     accent: "bg-indigo-50",
//     ring: "ring-indigo-100",
//   },
//   {
//     match: ["slack"],
//     file: "slack",
//     accent: "bg-fuchsia-50",
//     ring: "ring-fuchsia-100",
//   },
//   {
//     match: ["stripe"],
//     file: "stripe",
//     accent: "bg-violet-50",
//     ring: "ring-violet-100",
//   },
//   {
//     match: ["vercel"],
//     file: "vercel",
//     accent: "bg-neutral-50",
//     ring: "ring-neutral-200",
//   },
//   {
//     match: ["next"],
//     file: "next",
//     accent: "bg-neutral-50",
//     ring: "ring-neutral-200",
//   },
//   {
//     match: ["file"],
//     file: "file",
//     accent: "bg-amber-50",
//     ring: "ring-amber-100",
//   },
//   {
//     match: ["http", "webhook", "url", "globe", "web"],
//     file: "globe",
//     accent: "bg-cyan-50",
//     ring: "ring-cyan-100",
//   },
// ];

// /** Pick a real /logos/*.svg icon + accent color based on the node/provider name. */
// export const getNodeVisual = (key: string): NodeVisual => {
//   const lower = key.toLowerCase();
//   const rule = LOGO_RULES.find((r) => r.match.some((m) => lower.includes(m)));
//   if (rule) {
//     return {
//       logo: `/logos/${rule.file}.svg`,
//       accent: rule.accent,
//       ring: rule.ring,
//     };
//   }
//   return { logo: "/logos/logo.svg", accent: "bg-muted", ring: "ring-border" };
// };

// // ---------------------------------------------------------------------------
// // Lightweight markdown rendering (bold / code / italic / headings / lists)
// // ---------------------------------------------------------------------------

// /** Render **bold**, `code`, and *italic* inline markdown as JSX. */
// export const renderInline = (text: string): ReactNode => {
//   const parts = text.split(/(\*\*.+?\*\*|`.+?`|\*.+?\*)/g);
//   return parts.map((part, i) => {
//     if (part.startsWith("**") && part.endsWith("**")) {
//       return (
//         <strong key={i} className="font-semibold text-foreground">
//           {part.slice(2, -2)}
//         </strong>
//       );
//     }
//     if (part.startsWith("`") && part.endsWith("`")) {
//       return (
//         <code
//           key={i}
//           className="rounded bg-foreground/10 px-1 py-0.5 font-mono text-[0.8em]"
//         >
//           {part.slice(1, -1)}
//         </code>
//       );
//     }
//     if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
//       return (
//         <em key={i} className="italic">
//           {part.slice(1, -1)}
//         </em>
//       );
//     }
//     return <Fragment key={i}>{part}</Fragment>;
//   });
// };

// /** Turn a lightweight-markdown string (paragraphs, lists, headings) into JSX blocks. */
// export const renderMarkdownBlock = (text: string) => {
//   const lines = text.split("\n");
//   const elements: ReactNode[] = [];
//   let listItems: string[] = [];

//   const flushList = () => {
//     if (listItems.length > 0) {
//       elements.push(
//         <ul
//           key={`list-${elements.length}`}
//           className="my-1.5 list-disc space-y-1 pl-5"
//         >
//           {listItems.map((item, i) => (
//             <li key={i} className="text-sm leading-relaxed">
//               {renderInline(item)}
//             </li>
//           ))}
//         </ul>
//       );
//       listItems = [];
//     }
//   };

//   lines.forEach((rawLine, idx) => {
//     const line = rawLine.trim();

//     if (!line) {
//       flushList();
//       return;
//     }
//     if (line.startsWith("- ") || line.startsWith("* ")) {
//       listItems.push(line.slice(2));
//       return;
//     }
//     if (line.startsWith("### ")) {
//       flushList();
//       elements.push(
//         <h4 key={idx} className="mt-3 text-sm font-semibold text-foreground">
//           {renderInline(line.slice(4))}
//         </h4>
//       );
//       return;
//     }
//     if (line.startsWith("## ") || line.startsWith("# ")) {
//       flushList();
//       const content = line.replace(/^##?\s/, "");
//       elements.push(
//         <h3 key={idx} className="mt-3 text-base font-semibold text-foreground">
//           {renderInline(content)}
//         </h3>
//       );
//       return;
//     }
//     flushList();
//     elements.push(
//       <p key={idx} className="text-sm leading-relaxed text-foreground/90">
//         {renderInline(line)}
//       </p>
//     );
//   });

//   flushList();
//   return elements;
// };

// // ---------------------------------------------------------------------------
// // JSON syntax highlighting
// // ---------------------------------------------------------------------------

// /** Colorized, indented JSON for anything that isn't plain prose. */
// export const syntaxHighlightJson = (value: unknown) => {
//   const json = JSON.stringify(value, null, 2);
//   const escaped = json
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;");

//   return escaped.replace(
//     /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
//     (match) => {
//       let cls = "text-amber-600 dark:text-amber-400"; // number
//       if (/^"/.test(match)) {
//         cls = /:$/.test(match)
//           ? "text-violet-600 dark:text-violet-400"
//           : "text-emerald-600 dark:text-emerald-400";
//       } else if (/true|false/.test(match)) {
//         cls = "text-blue-600 dark:text-blue-400";
//       } else if (/null/.test(match)) {
//         cls = "text-rose-500 dark:text-rose-400";
//       }
//       return `<span class="${cls}">${match}</span>`;
//     }
//   );
// };

// // ---------------------------------------------------------------------------
// // Length heuristics (used to decide when to switch on the scroll effect)
// // ---------------------------------------------------------------------------

// /** Rough estimate of how many visual lines a block of text will wrap to. */
// export const estimateLineCount = (text: string, charsPerLine = 90) =>
//   text
//     .split("\n")
//     .reduce(
//       (total, line) =>
//         total + Math.max(1, Math.ceil(line.length / charsPerLine)),
//       0
//     );





//new updated features 

import { Fragment, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Node naming + visuals
// ---------------------------------------------------------------------------

/**
 * Convert node keys such as:
 * Gemini_AI       -> Gemini AI
 * httpRequest     -> Http Request
 * google_form     -> Google Form
 */
export const formatNodeName = (key: string): string => {
  if (!key) return "Unknown";

  const spaced = key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();

  if (!spaced) return "Unknown";

  return spaced
    .split(" ")
    .map((word) => {
      if (!word) return "";

      // Keep common acronyms uppercase.
      if (
        word.length <= 4 &&
        word === word.toUpperCase() &&
        /[A-Z]/.test(word)
      ) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

export type NodeVisual = {
  logo: string;
  accent: string;
  ring: string;
};

// ---------------------------------------------------------------------------
// Node/provider logos
// ---------------------------------------------------------------------------

type LogoRule = {
  match: string[];
  file: string;
  accent: string;
  ring: string;
};

const LOGO_RULES: LogoRule[] = [
  {
    match: ["gemini", "google-ai", "googleai"],
    file: "gemini",
    accent: "bg-blue-50 dark:bg-blue-950/30",
    ring: "ring-blue-100 dark:ring-blue-900",
  },
  {
    match: ["googleform", "google_form"],
    file: "googleform",
    accent: "bg-purple-50 dark:bg-purple-950/30",
    ring: "ring-purple-100 dark:ring-purple-900",
  },
  {
    match: ["google"],
    file: "google",
    accent: "bg-blue-50 dark:bg-blue-950/30",
    ring: "ring-blue-100 dark:ring-blue-900",
  },
  {
    match: ["gpt", "openai"],
    file: "openai",
    accent: "bg-emerald-50 dark:bg-emerald-950/30",
    ring: "ring-emerald-100 dark:ring-emerald-900",
  },
  {
    match: ["claude", "anthropic"],
    file: "anthropic",
    accent: "bg-orange-50 dark:bg-orange-950/30",
    ring: "ring-orange-100 dark:ring-orange-900",
  },
  {
    match: ["github"],
    file: "github",
    accent: "bg-slate-50 dark:bg-slate-900/40",
    ring: "ring-slate-200 dark:ring-slate-700",
  },
  {
    match: ["discord"],
    file: "discord",
    accent: "bg-indigo-50 dark:bg-indigo-950/30",
    ring: "ring-indigo-100 dark:ring-indigo-900",
  },
  {
    match: ["slack"],
    file: "slack",
    accent: "bg-fuchsia-50 dark:bg-fuchsia-950/30",
    ring: "ring-fuchsia-100 dark:ring-fuchsia-900",
  },
  {
    match: ["stripe"],
    file: "stripe",
    accent: "bg-violet-50 dark:bg-violet-950/30",
    ring: "ring-violet-100 dark:ring-violet-900",
  },
  {
    match: ["vercel"],
    file: "vercel",
    accent: "bg-neutral-50 dark:bg-neutral-900/40",
    ring: "ring-neutral-200 dark:ring-neutral-700",
  },
  {
    match: ["nextjs", "next-js", "next"],
    file: "next",
    accent: "bg-neutral-50 dark:bg-neutral-900/40",
    ring: "ring-neutral-200 dark:ring-neutral-700",
  },
  {
    match: ["file"],
    file: "file",
    accent: "bg-amber-50 dark:bg-amber-950/30",
    ring: "ring-amber-100 dark:ring-amber-900",
  },
  {
    match: ["http", "webhook", "url", "globe", "web"],
    file: "globe",
    accent: "bg-cyan-50 dark:bg-cyan-950/30",
    ring: "ring-cyan-100 dark:ring-cyan-900",
  },
];

/**
 * Find a logo and visual styling for a node/provider.
 */
export const getNodeVisual = (key: string): NodeVisual => {
  const lower = key.toLowerCase().trim();

  if (!lower) {
    return {
      logo: "/logos/logo.svg",
      accent: "bg-muted",
      ring: "ring-border",
    };
  }

  const rule = LOGO_RULES.find((item) =>
    item.match.some((match) => lower.includes(match.toLowerCase()))
  );

  if (!rule) {
    return {
      logo: "/logos/logo.svg",
      accent: "bg-muted",
      ring: "ring-border",
    };
  }

  return {
    logo: `/logos/${rule.file}.svg`,
    accent: rule.accent,
    ring: rule.ring,
  };
};

// ---------------------------------------------------------------------------
// Inline Markdown
// ---------------------------------------------------------------------------

/**
 * Render lightweight inline Markdown:
 *
 * **bold**
 * *italic*
 * `code`
 */
export const renderInline = (text: string): ReactNode => {
  if (!text) return null;

  const parts = text.split(
    /(\*\*[^*\n]+?\*\*|`[^`\n]+?`|\*[^*\n]+?\*)/g
  );

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold
    if (
      part.startsWith("**") &&
      part.endsWith("**") &&
      part.length > 4
    ) {
      return (
        <strong
          key={`bold-${index}`}
          className="font-semibold text-foreground"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Inline code
    if (
      part.startsWith("`") &&
      part.endsWith("`") &&
      part.length > 2
    ) {
      return (
        <code
          key={`code-${index}`}
          className="
            rounded-md
            border
            border-border/60
            bg-muted
            px-1.5
            py-0.5
            font-mono
            text-[0.82em]
            text-foreground
          "
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Italic
    if (
      part.startsWith("*") &&
      part.endsWith("*") &&
      !part.startsWith("**") &&
      part.length > 2
    ) {
      return (
        <em key={`italic-${index}`} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }

    return <Fragment key={`text-${index}`}>{part}</Fragment>;
  });
};

// ---------------------------------------------------------------------------
// Markdown blocks
// ---------------------------------------------------------------------------

type MarkdownCodeBlock = {
  language: string;
  code: string;
};

const isUnorderedList = (line: string) =>
  /^[-*+]\s+/.test(line);

const isOrderedList = (line: string) =>
  /^\d+\.\s+/.test(line);

const getListContent = (line: string) => {
  return line
    .replace(/^[-*+]\s+/, "")
    .replace(/^\d+\.\s+/, "")
    .trim();
};

/**
 * Lightweight Markdown renderer.
 *
 * Supports:
 * - # headings
 * - ## headings
 * - ### headings
 * - unordered lists
 * - ordered lists
 * - bold
 * - italic
 * - inline code
 * - fenced code blocks
 * - paragraphs
 */
export const renderMarkdownBlock = (text: string): ReactNode[] => {
  if (!text?.trim()) {
    return [];
  }

  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const elements: ReactNode[] = [];

  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;

  let codeLines: string[] = [];
  let codeLanguage = "";
  let insideCodeBlock = false;

  const flushList = () => {
    if (!listItems.length || !listType) return;

    if (listType === "ul") {
      elements.push(
        <ul
          key={`ul-${elements.length}`}
          className="my-2 list-disc space-y-1.5 pl-6"
        >
          {listItems.map((item, index) => (
            <li
              key={`li-${index}`}
              className="text-sm leading-6 text-foreground/90"
            >
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol
          key={`ol-${elements.length}`}
          className="my-2 list-decimal space-y-1.5 pl-6"
        >
          {listItems.map((item, index) => (
            <li
              key={`oli-${index}`}
              className="text-sm leading-6 text-foreground/90"
            >
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
    }

    listItems = [];
    listType = null;
  };

  const flushCodeBlock = () => {
    if (!insideCodeBlock) return;

    elements.push(
      <div
        key={`code-block-${elements.length}`}
        className="
          my-3
          overflow-hidden
          rounded-xl
          border
          border-border
          bg-zinc-950
          shadow-sm
        "
      >
        {codeLanguage && (
          <div
            className="
              flex
              items-center
              border-b
              border-white/10
              bg-white/[0.03]
              px-3
              py-2
              text-[11px]
              font-medium
              uppercase
              tracking-wide
              text-zinc-400
            "
          >
            {codeLanguage}
          </div>
        )}

        <pre
          className="
            overflow-x-auto
            p-4
            text-xs
            leading-6
            text-zinc-100
          "
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      </div>
    );

    codeLines = [];
    codeLanguage = "";
    insideCodeBlock = false;
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    // ---------------------------------------------------------
    // Fenced code block
    // ---------------------------------------------------------

    if (trimmed.startsWith("```")) {
      if (insideCodeBlock) {
        flushCodeBlock();
      } else {
        flushList();

        insideCodeBlock = true;

        codeLanguage = trimmed
          .replace(/^```/, "")
          .trim()
          .toLowerCase();
      }

      return;
    }

    if (insideCodeBlock) {
      codeLines.push(line);
      return;
    }

    // Empty line
    if (!trimmed) {
      flushList();
      return;
    }

    // ---------------------------------------------------------
    // Headings
    // ---------------------------------------------------------

    if (trimmed.startsWith("### ")) {
      flushList();

      elements.push(
        <h4
          key={`h4-${index}`}
          className="
            mt-4
            mb-2
            text-sm
            font-semibold
            leading-6
            text-foreground
          "
        >
          {renderInline(trimmed.slice(4))}
        </h4>
      );

      return;
    }

    if (trimmed.startsWith("## ")) {
      flushList();

      elements.push(
        <h3
          key={`h3-${index}`}
          className="
            mt-5
            mb-2
            text-base
            font-semibold
            leading-6
            text-foreground
          "
        >
          {renderInline(trimmed.slice(3))}
        </h3>
      );

      return;
    }

    if (trimmed.startsWith("# ")) {
      flushList();

      elements.push(
        <h2
          key={`h2-${index}`}
          className="
            mt-5
            mb-3
            text-lg
            font-bold
            leading-7
            text-foreground
          "
        >
          {renderInline(trimmed.slice(2))}
        </h2>
      );

      return;
    }

    // ---------------------------------------------------------
    // Unordered list
    // ---------------------------------------------------------

    if (isUnorderedList(trimmed)) {
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }

      listItems.push(getListContent(trimmed));
      return;
    }

    // ---------------------------------------------------------
    // Ordered list
    // ---------------------------------------------------------

    if (isOrderedList(trimmed)) {
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }

      listItems.push(getListContent(trimmed));
      return;
    }

    // ---------------------------------------------------------
    // Horizontal rule
    // ---------------------------------------------------------

    if (/^([-*_])(?:\s*\1){2,}$/.test(trimmed)) {
      flushList();

      elements.push(
        <hr
          key={`hr-${index}`}
          className="my-4 border-border"
        />
      );

      return;
    }

    // ---------------------------------------------------------
    // Normal paragraph
    // ---------------------------------------------------------

    flushList();

    elements.push(
      <p
        key={`paragraph-${index}`}
        className="
          text-sm
          leading-6
          text-foreground/90
        "
      >
        {renderInline(trimmed)}
      </p>
    );
  });

  flushList();

  if (insideCodeBlock) {
    flushCodeBlock();
  }

  return elements;
};

// ---------------------------------------------------------------------------
// JSON utilities
// ---------------------------------------------------------------------------

/**
 * Safely convert any value to pretty JSON.
 */
export const safeJsonStringify = (
  value: unknown,
  space = 2
): string => {
  try {
    const result = JSON.stringify(value, null, space);

    if (result === undefined) {
      return String(value);
    }

    return result;
  } catch {
    return String(value);
  }
};

/**
 * Escape HTML before inserting highlighted JSON.
 */
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

/**
 * Colorized JSON HTML.
 *
 * IMPORTANT:
 * Use this only with:
 *
 * dangerouslySetInnerHTML={{
 *   __html: syntaxHighlightJson(value)
 * }}
 */
export const syntaxHighlightJson = (value: unknown): string => {
  const json = safeJsonStringify(value, 2);
  const escaped = escapeHtml(json);

  return escaped.replace(
    /(&quot;(?:\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\&quot;])*?&quot;)(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g,
    (match, stringValue: string, colon: string | undefined) => {
      // JSON property name
      if (stringValue) {
        if (colon) {
          return `<span class="text-violet-600 dark:text-violet-400">${stringValue}</span>${colon}`;
        }

        // JSON string
        return `<span class="text-emerald-600 dark:text-emerald-400">${stringValue}</span>`;
      }

      // Boolean
      if (match === "true" || match === "false") {
        return `<span class="text-blue-600 dark:text-blue-400">${match}</span>`;
      }

      // Null
      if (match === "null") {
        return `<span class="text-rose-500 dark:text-rose-400">${match}</span>`;
      }

      // Number
      return `<span class="text-amber-600 dark:text-amber-400">${match}</span>`;
    }
  );
};

// ---------------------------------------------------------------------------
// Output normalization
// ---------------------------------------------------------------------------

/**
 * Convert an arbitrary execution output into something displayable.
 */
export const normalizeOutput = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return String(value);
  }

  return safeJsonStringify(value, 2);
};

/**
 * Try to extract a human-readable text field from an AI response.
 *
 * Example:
 *
 * {
 *   "Gemini AI": {
 *     "text": "Python is..."
 *   }
 * }
 *
 * becomes:
 *
 * Python is...
 */
export const extractOutputText = (value: unknown): string | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const object = value as Record<string, unknown>;

  // Direct text response
  if (typeof object.text === "string") {
    return object.text;
  }

  // Direct content response
  if (typeof object.content === "string") {
    return object.content;
  }

  // Common AI response structures
  if (typeof object.output === "string") {
    return object.output;
  }

  if (typeof object.response === "string") {
    return object.response;
  }

  return null;
};

// ---------------------------------------------------------------------------
// Length heuristics
// ---------------------------------------------------------------------------

/**
 * Estimate visual line count.
 *
 * This is intentionally approximate and is used only for deciding
 * whether an output should become a slide/card.
 */
export const estimateLineCount = (
  text: string,
  charsPerLine = 90
): number => {
  if (!text) return 0;

  const safeCharsPerLine = Math.max(20, charsPerLine);

  return text
    .split(/\r?\n/)
    .reduce((total, line) => {
      const length = line.length;

      return (
        total +
        Math.max(
          1,
          Math.ceil(length / safeCharsPerLine)
        )
      );
    }, 0);
};

/**
 * Decide whether output is long enough to use the slide/card UI.
 *
 * Your requested threshold is approximately 6–7 lines.
 */
export const isLongOutput = (
  text: string,
  threshold = 7
): boolean => {
  return estimateLineCount(text) > threshold;
};

/**
 * Split a long output into readable chunks.
 *
 * Paragraphs are preferred as boundaries. If no paragraphs exist,
 * the function falls back to line-based chunks.
 */
export const splitOutputIntoSlides = (
  text: string,
  maxLines = 7
): string[] => {
  if (!text.trim()) {
    return [];
  }

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length > 1) {
    const slides: string[] = [];
    let current = "";

    for (const paragraph of paragraphs) {
      const candidate = current
        ? `${current}\n\n${paragraph}`
        : paragraph;

      if (
        current &&
        estimateLineCount(candidate) > maxLines
      ) {
        slides.push(current);
        current = paragraph;
      } else {
        current = candidate;
      }
    }

    if (current) {
      slides.push(current);
    }

    return slides;
  }

  // Fallback: line based splitting.
  const lines = text.split(/\r?\n/);
  const slides: string[] = [];

  for (let index = 0; index < lines.length; index += maxLines) {
    const chunk = lines
      .slice(index, index + maxLines)
      .join("\n")
      .trim();

    if (chunk) {
      slides.push(chunk);
    }
  }

  return slides;
};

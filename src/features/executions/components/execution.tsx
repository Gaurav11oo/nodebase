// "use client";

// import { ExecutionStatus } from "@/generated/prisma/enums";
// import {
//   CheckCircle2Icon,
//   ClockIcon,
//   Loader2Icon,
//   XCircleIcon,
// } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";
// import Link from "next/link";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { useSuspenseExecution } from "@/features/executions/hooks/use-executions";
// import { OutputViewer } from "@/components/ui/output-viewer";

// const getStatusIcon = (status: ExecutionStatus) => {
//   switch (status) {
//     case ExecutionStatus.SUCCESS:
//       return <CheckCircle2Icon className="size-5 text-green-600" />;
//     case ExecutionStatus.FAILED:
//       return <XCircleIcon className="size-5 text-red-600" />;
//     case ExecutionStatus.RUNNING:
//       return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
//     default:
//       return <ClockIcon className="size-5 text-muted-foreground" />;
//   }
// };

// const formatStatus = (status: ExecutionStatus) => {
//   return status.charAt(0) + status.slice(1).toLowerCase();
// };

// export const ExecutionView = ({ executionId }: { executionId: string }) => {
//   const { data: execution } = useSuspenseExecution(executionId);
//   const [showStackTrace, setShowStackTrace] = useState(false);

//   const duration = execution.completedAt
//     ? Math.round(
//         (new Date(execution.completedAt).getTime() -
//           new Date(execution.startedAt).getTime()) /
//           1000
//       )
//     : null;

//   return (
//     <Card className="shadow-none">
//       <CardHeader>
//         <div className="flex items-center gap-3">
//           {getStatusIcon(execution.status)}
//           <div>
//             <CardTitle>{formatStatus(execution.status)}</CardTitle>
//             <CardDescription>
//               Execution for {execution.workflow.name}
//             </CardDescription>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <p className="text-sm font-medium text-muted-foreground">
//               Workflow
//             </p>
//             <Link
//               prefetch
//               className="text-sm hover:underline text-primary"
//               href={`/workflows/${execution.workflowId}`}
//             >
//               {execution.workflow.name}
//             </Link>
//           </div>

//           <div>
//             <p className="text-sm font-medium text-muted-foreground">Status</p>
//             <p className="text-sm">{formatStatus(execution.status)}</p>
//           </div>

//           <div>
//             <p className="text-sm font-medium text-muted-foreground">Started</p>
//             <p className="text-sm">
//               {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
//             </p>
//           </div>

//           {execution.completedAt ? (
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">
//                 Completed
//               </p>
//               <p className="text-sm">
//                 {formatDistanceToNow(execution.completedAt, {
//                   addSuffix: true,
//                 })}
//               </p>
//             </div>
//           ) : null}

//           {duration !== null ? (
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">
//                 Duration
//               </p>
//               <p className="text-sm">{duration}s</p>
//             </div>
//           ) : null}

//           <div>
//             <p className="text-sm font-medium text-muted-foreground">
//               Event ID
//             </p>
//             <p className="text-sm">{execution.inngestEventId}</p>
//           </div>
//         </div>
//         {execution.error && (
//           <div className="mt-6 p-4 bg-red-50 rounded-md space-y-3">
//             <div>
//               <p className="text-sm font-medium text-red-900 mb-2">Error</p>
//               <p className="text-sm text-red-800 font-mono">
//                 {execution.error}
//               </p>
//             </div>

//             {execution.errorStack && (
//               <Collapsible
//                 open={showStackTrace}
//                 onOpenChange={setShowStackTrace}
//               >
//                 <CollapsibleTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="text-red-900 hover:bg-red-100"
//                   >
//                     {showStackTrace ? "Hide stack trace" : "Show stack trace"}
//                   </Button>
//                 </CollapsibleTrigger>
//                 <CollapsibleContent>
//                   <pre className="text-xs font-mono text-red-800 overflow-auto mt-2 p-2 bg-red-100">
//                     {execution.errorStack}
//                   </pre>
//                 </CollapsibleContent>
//               </Collapsible>
//             )}
//           </div>
//         )}

//         {execution.output && (
//           <div className="mt-6">
//             <OutputViewer data={execution.output} />
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };
"use client";

import { ExecutionStatus } from "@/generated/prisma/enums";
import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  XCircleIcon,
  CheckIcon,
  CopyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Fragment, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSuspenseExecution } from "@/features/executions/hooks/use-executions";

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-green-600" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-red-600" />;
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
    default:
      return <ClockIcon className="size-5 text-muted-foreground" />;
  }
};

const formatStatus = (status: ExecutionStatus) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};

// ---------------------------------------------------------------------------
// Output formatting helpers
// ---------------------------------------------------------------------------

/** Turn a node key like "Gemini_AI" or "httpRequest" into "Gemini AI" / "Http Request" */
const formatNodeName = (key: string) => {
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

type NodeVisual = { logo: string; accent: string; ring: string };

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
const getNodeVisual = (key: string): NodeVisual => {
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

/** Render **bold**, `code`, and *italic* inline markdown as JSX. */
const renderInline = (text: string): ReactNode => {
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
const renderMarkdownBlock = (text: string) => {
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

/** Colorized, indented JSON for anything that isn't plain prose. */
const syntaxHighlightJson = (value: unknown) => {
  const json = JSON.stringify(value, null, 2);
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const highlighted = escaped.replace(
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

  return highlighted;
};

/** Rough estimate of how many visual lines a block of text will wrap to. */
const estimateLineCount = (text: string, charsPerLine = 90) =>
  text
    .split("\n")
    .reduce(
      (total, line) =>
        total + Math.max(1, Math.ceil(line.length / charsPerLine)),
      0
    );

const SLIDE_LINE_THRESHOLD = 8;
const SLIDE_CHAR_BUDGET = 650;

/** Break long text into slide-sized chunks, keeping whole lines together. */
const chunkTextIntoSlides = (text: string, budgetChars = SLIDE_CHAR_BUDGET) => {
  const lines = text.split("\n");
  const slides: string[] = [];
  let current: string[] = [];
  let currentLen = 0;

  const pushCurrent = () => {
    if (current.length > 0) {
      slides.push(current.join("\n"));
      current = [];
      currentLen = 0;
    }
  };

  for (const line of lines) {
    const lineLen = Math.max(line.length, 1);
    if (currentLen + lineLen > budgetChars && current.length > 0) {
      pushCurrent();
    }
    current.push(line);
    currentLen += lineLen;
  }
  pushCurrent();

  return slides.length > 0 ? slides : [text];
};

/** Paginated "slide card" view for long-form text output, with dot + arrow navigation. */
const SlideOutput = ({ text }: { text: string }) => {
  const slides = useMemo(() => chunkTextIntoSlides(text), [text]);
  const [index, setIndex] = useState(0);

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(slides.length - 1, i + 1));

  return (
    <div className="space-y-3">
      <div className="min-h-[3rem]">{renderMarkdownBlock(slides[index])}</div>

      <div className="flex items-center justify-between border-t pt-2">
        <button
          type="button"
          onClick={goPrev}
          disabled={index === 0}
          aria-label="Previous slide"
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeftIcon className="size-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-4 bg-foreground/70" : "w-1.5 bg-foreground/20"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={index === slides.length - 1}
          aria-label="Next slide"
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>

      <p className="text-center text-[0.7rem] text-muted-foreground">
        Slide {index + 1} of {slides.length}
      </p>
    </div>
  );
};

/** Prose renderer that switches to paginated slide cards once the text runs long. */
const ProseOutput = ({ text }: { text: string }) => {
  if (estimateLineCount(text) > SLIDE_LINE_THRESHOLD) {
    return <SlideOutput text={text} />;
  }
  return <>{renderMarkdownBlock(text)}</>;
};

/** A single node's output: markdown-ish text if we find one, otherwise pretty JSON. */
const NodeOutputBody = ({ value }: { value: unknown }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const text =
        typeof value === "string" ? value : JSON.stringify(value, null, 2);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be unavailable; fail silently
    }
  };

  // Case 1: plain string output
  if (typeof value === "string") {
    return (
      <div className="group relative">
        <button
          type="button"
          onClick={handleCopy}
          className="absolute right-0 top-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-foreground/5 group-hover:opacity-100"
          aria-label="Copy output"
        >
          {copied ? (
            <CheckIcon className="size-3.5 text-green-600" />
          ) : (
            <CopyIcon className="size-3.5" />
          )}
        </button>
        <div className="pr-8">
          <ProseOutput text={value} />
        </div>
      </div>
    );
  }

  // Case 2: object with a recognizable prose field (text / content / message / answer)
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    const proseKey = ["text", "content", "message", "answer", "output"].find(
      (key) => typeof obj[key] === "string"
    );

    if (proseKey) {
      const prose = obj[proseKey] as string;
      const rest = Object.fromEntries(
        Object.entries(obj).filter(([key]) => key !== proseKey)
      );
      const hasRest = Object.keys(rest).length > 0;

      return (
        <div className="space-y-3">
          <div className="group relative">
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-0 top-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-foreground/5 group-hover:opacity-100"
              aria-label="Copy output"
            >
              {copied ? (
                <CheckIcon className="size-3.5 text-green-600" />
              ) : (
                <CopyIcon className="size-3.5" />
              )}
            </button>
            <div className="pr-8">
              <ProseOutput text={prose} />
            </div>
          </div>

          {hasRest && (
            <details className="group/details">
              <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
                Additional fields
              </summary>
              <pre
                className="mt-2 overflow-auto rounded-md bg-background p-3 font-mono text-xs leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: syntaxHighlightJson(rest),
                }}
              />
            </details>
          )}
        </div>
      );
    }
  }

  // Case 3: fall back to pretty, colorized JSON
  return (
    <div className="group relative">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-1 top-1 rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-foreground/5 group-hover:opacity-100"
        aria-label="Copy output"
      >
        {copied ? (
          <CheckIcon className="size-3.5 text-green-600" />
        ) : (
          <CopyIcon className="size-3.5" />
        )}
      </button>
      <pre
        className="overflow-auto rounded-md bg-background p-3 font-mono text-xs leading-relaxed"
        dangerouslySetInnerHTML={{ __html: syntaxHighlightJson(value) }}
      />
    </div>
  );
};

/** The full Output section: one card per top-level node, each styled by provider. */
const OutputSection = ({ output }: { output: unknown }) => {
  const isKeyedByNode =
    output &&
    typeof output === "object" &&
    !Array.isArray(output) &&
    Object.values(output as Record<string, unknown>).every(
      (v) => typeof v === "object" && v !== null
    );

  if (!isKeyedByNode) {
    return (
      <div className="rounded-md bg-muted p-4">
        <p className="mb-2 text-sm font-medium">Output</p>
        <NodeOutputBody value={output} />
      </div>
    );
  }

  const entries = Object.entries(output as Record<string, unknown>);

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Output</p>
      <div className="space-y-3">
        {entries.map(([key, value]) => {
          const { logo, accent, ring } = getNodeVisual(key);
          return (
            <div
              key={key}
              className={`overflow-hidden rounded-lg border ring-1 ${ring}`}
            >
              <div
                className={`flex items-center gap-2 border-b px-3 py-2 ${accent}`}
              >
                <Image
                  src={logo}
                  alt=""
                  width={16}
                  height={16}
                  className="size-4"
                />
                <span className="text-sm font-semibold text-foreground">
                  {formatNodeName(key)}
                </span>
              </div>
              <div className="bg-muted/60 p-4">
                <NodeOutputBody value={value} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------

export const ExecutionView = ({ executionId }: { executionId: string }) => {
  const { data: execution } = useSuspenseExecution(executionId);
  const [showStackTrace, setShowStackTrace] = useState(false);

  const duration = execution.completedAt
    ? Math.round(
        (new Date(execution.completedAt).getTime() -
          new Date(execution.startedAt).getTime()) /
          1000
      )
    : null;

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex items-center gap-3">
          {getStatusIcon(execution.status)}
          <div>
            <CardTitle>{formatStatus(execution.status)}</CardTitle>
            <CardDescription>
              Execution for {execution.workflow.name}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Workflow
            </p>
            <Link
              prefetch
              className="text-sm hover:underline text-primary"
              href={`/workflows/${execution.workflowId}`}
            >
              {execution.workflow.name}
            </Link>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-sm">{formatStatus(execution.status)}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Started</p>
            <p className="text-sm">
              {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
            </p>
          </div>

          {execution.completedAt ? (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed
              </p>
              <p className="text-sm">
                {formatDistanceToNow(execution.completedAt, {
                  addSuffix: true,
                })}
              </p>
            </div>
          ) : null}

          {duration !== null ? (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Duration
              </p>
              <p className="text-sm">{duration}s</p>
            </div>
          ) : null}

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Event ID
            </p>
            <p className="text-sm">{execution.inngestEventId}</p>
          </div>
        </div>
        {execution.error && (
          <div className="mt-6 p-4 bg-red-50 rounded-md space-y-3">
            <div>
              <p className="text-sm font-medium text-red-900 mb-2">Error</p>
              <p className="text-sm text-red-800 font-mono">
                {execution.error}
              </p>
            </div>

            {execution.errorStack && (
              <Collapsible
                open={showStackTrace}
                onOpenChange={setShowStackTrace}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-900 hover:bg-red-100"
                  >
                    {showStackTrace ? "Hide stack trace" : "Show stack trace"}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <pre className="text-xs font-mono text-red-800 overflow-auto mt-2 p-2 bg-red-100">
                    {execution.errorStack}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        )}

        {execution.output != null && (
          <div className="mt-6">
            <OutputSection output={execution.output} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

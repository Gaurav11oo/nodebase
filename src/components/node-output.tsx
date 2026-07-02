"use client";

import Image from "next/image";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import {
  estimateLineCount,
  formatNodeName,
  getNodeVisual,
  renderMarkdownBlock,
  syntaxHighlightJson,
} from "@/lib/output-formatters";
import { ScrollableOutput } from "@/components/scrollable-output";

const SCROLL_LINE_THRESHOLD = 8;

/** Prose renderer that switches on the scroll effect once the text runs long. */
const ProseOutput = ({ text }: { text: string }) => {
  const blocks = renderMarkdownBlock(text);

  if (estimateLineCount(text) > SCROLL_LINE_THRESHOLD) {
    return (
      <ScrollableOutput fadeClassName="from-muted/80">
        {blocks}
      </ScrollableOutput>
    );
  }
  return <>{blocks}</>;
};

const CopyButton = ({
  getText,
  className = "absolute right-0 top-0",
}: {
  getText: () => string;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be unavailable; fail silently
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${className} rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-foreground/5 group-hover:opacity-100`}
      aria-label="Copy output"
    >
      {copied ? (
        <CheckIcon className="size-3.5 text-green-600" />
      ) : (
        <CopyIcon className="size-3.5" />
      )}
    </button>
  );
};

/** A single node's output: markdown-ish text if we find one, otherwise pretty JSON. */
export const NodeOutputBody = ({ value }: { value: unknown }) => {
  // Case 1: plain string output
  if (typeof value === "string") {
    return (
      <div className="group relative">
        <CopyButton getText={() => value} />
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
            <CopyButton getText={() => prose} />
            <div className="pr-8">
              <ProseOutput text={prose} />
            </div>
          </div>

          {hasRest && (
            <details className="group/details">
              <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
                Additional fields
              </summary>
              <div className="mt-2">
                <ScrollableOutput
                  maxHeight={180}
                  fadeClassName="from-background"
                >
                  <pre
                    className="overflow-x-auto rounded-md bg-background p-3 font-mono text-xs leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: syntaxHighlightJson(rest),
                    }}
                  />
                </ScrollableOutput>
              </div>
            </details>
          )}
        </div>
      );
    }
  }

  // Case 3: fall back to pretty, colorized JSON
  return (
    <div className="group relative">
      <CopyButton
        getText={() => JSON.stringify(value, null, 2)}
        className="absolute right-1 top-1"
      />
      <ScrollableOutput fadeClassName="from-background">
        <pre
          className="overflow-x-auto rounded-md bg-background p-3 font-mono text-xs leading-relaxed"
          dangerouslySetInnerHTML={{ __html: syntaxHighlightJson(value) }}
        />
      </ScrollableOutput>
    </div>
  );
};

/** The full Output section: one card per top-level node, each styled by provider. */
export const OutputSection = ({ output }: { output: unknown }) => {
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

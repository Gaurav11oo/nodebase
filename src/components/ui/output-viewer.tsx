"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Braces,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Hash,
  List,
  Quote,
} from "lucide-react";

interface OutputViewerProps {
  data: unknown;
}

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const RenderValue = ({ value }: { value: unknown }) => {
  if (value === null) {
    return <span className="italic text-muted-foreground">null</span>;
  }

  if (typeof value === "boolean") {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle2 className="size-4" />
        {String(value)}
      </div>
    );
  }

  if (typeof value === "number") {
    return <span className="font-semibold text-emerald-600">{value}</span>;
  }

  if (typeof value === "string") {
    if (isUrl(value)) {
      return (
        <Link
          href={value}
          target="_blank"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline break-all"
        >
          {value}
          <ExternalLink className="size-3" />
        </Link>
      );
    }

    return (
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-3">
        {value.map((item, index) => (
          <div key={index} className="rounded-lg border bg-background p-4">
            <div className="flex items-center gap-2 mb-3">
              <List className="size-4 text-primary" />
              <span className="font-medium">Item {index + 1}</span>
            </div>

            <RenderValue value={item} />
          </div>
        ))}
      </div>
    );
  }

  if (isObject(value)) {
    return (
      <div className="space-y-4">
        {Object.entries(value).map(([key, val]) => (
          <div key={key} className="rounded-xl border bg-background shadow-sm">
            <div className="flex items-center gap-2 border-b px-4 py-3 bg-muted/50">
              <Hash className="size-4 text-primary" />

              <span className="font-semibold">{key}</span>
            </div>

            <div className="p-4">
              <RenderValue value={val} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <span className="text-muted-foreground">{String(value)}</span>;
};

export const OutputViewer = ({ data }: OutputViewerProps) => {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <Braces className="size-5 text-primary" />

        <h3 className="font-semibold">Workflow Output</h3>
      </div>

      <div className="p-5">
        <RenderValue value={data} />
      </div>
    </div>
  );
};

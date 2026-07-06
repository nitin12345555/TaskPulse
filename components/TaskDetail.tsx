"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { useTaskStore, selectSelectedTask } from "@/lib/store";
import { formatDate, formatRelativeAge } from "@/lib/utils";

export function TaskDetail() {
  const task = useTaskStore(selectSelectedTask);
  const summary = useTaskStore((state) => state.summary);
  const summaryLoading = useTaskStore((state) => state.summaryLoading);
  const summaryError = useTaskStore((state) => state.summaryError);

  if (!task) {
    return (
      <section className="flex h-full items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-white p-4 shadow-sm">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-zinc-700">Task Details</h2>
          <p className="mt-1 text-sm text-zinc-500">Select a task to see its details and AI summary.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 rounded-xl bg-white p-4 shadow-sm sm:p-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-zinc-900">{task.title}</h2>
        <div className="font-mono text-xs text-zinc-500">{task.id}</div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-zinc-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Status</div>
          <div className="mt-1 text-base font-bold text-zinc-800">{task.status}</div>
        </div>
        <div className="rounded-lg bg-zinc-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Type</div>
          <div className="mt-1 text-base font-bold text-zinc-800">{task.type}</div>
        </div>
        <div className="rounded-lg bg-zinc-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Assignee</div>
          <div className="mt-1 text-base font-bold text-zinc-800">{task.assignee?.name ?? "Unassigned"}</div>
        </div>
        <div className="rounded-lg bg-zinc-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Last Updated</div>
          <div className="mt-1 text-base font-bold text-zinc-800">{formatDate(task.updatedAt)}</div>
          <div className="text-xs text-zinc-500">{formatRelativeAge(task.updatedAt)} ago</div>
        </div>
      </div>

      <div className="rounded-lg bg-black p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">AI Summary</h3>
        <div className="mt-3">
          {summaryLoading && <div className="text-sm text-zinc-600">Streaming summary…</div>}
          {summaryError && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-900">{summaryError}</div>}
          {!summaryLoading && !summaryError && !summary && <div className="text-sm text-zinc-600">Summary available.</div>}
        </div>
        {summary && (
          <div className="prose prose-sm prose-zinc max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
              {summary}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </section>
  );
}

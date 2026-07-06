"use client";

import { useMemo } from "react";
import { useTaskStore } from "@/lib/store";

export function TaskTicker() {
  const tasks = useTaskStore((state) => state.taskOrder.map((id) => state.tasks[id]).filter(Boolean));

  const stats = useMemo(
    () => ({
      total: tasks.length,
      todo: tasks.filter((task) => task.status === "todo").length,
      inProgress: tasks.filter((task) => task.status === "in_progress").length,
      done: tasks.filter((task) => task.status === "done").length,
      blocked: tasks.filter((task) => task.status === "blocked").length,
      qa: tasks.filter((task) => task.status === "qa").length,
    }),
    [tasks]
  );

  return (
    <section>
      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
        <TickerCard label="Total" value={stats.total} />
        <TickerCard label="Todo" value={stats.todo} />
        <TickerCard label="In Progress" value={stats.inProgress} />
        <TickerCard label="Done" value={stats.done} className="text-green-600" />
        <TickerCard label="Blocked" value={stats.blocked} />
        <TickerCard label="QA" value={stats.qa} />
      </div>
    </section>
  );
}

function TickerCard({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div className="rounded-lg bg-zinc-50/70 p-3 text-center">
      <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={`mt-1 text-2xl font-bold text-zinc-900 ${className}`}>{value}</div>
    </div>
  );
}

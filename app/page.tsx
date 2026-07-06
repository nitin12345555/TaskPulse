"use client";

import { TaskTicker } from "@/buggy/TaskTicker";
import { TaskList } from "@/components/TaskList";
import { TaskDetail } from "@/components/TaskDetail";
import { useTaskFeed } from "@/hooks/useTaskFeed";
import { useSummaryStream } from "@/hooks/useSummaryStream";
import { useTaskStore } from "@/lib/store";

export default function Home() {
  const selectedTaskId = useTaskStore((state) => state.selectedTaskId);

  useTaskFeed();
  useSummaryStream(selectedTaskId);

  return (
    <div className="min-h-screen bg-zinc-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-screen-2xl space-y-6">
        <header className="rounded-xl bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">TaskPulse</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Annotation Activity Console
            </h1>
            <p className="mt-2 text-sm text-zinc-600">An internal dashboard for monitoring annotation tasks in real-time.</p>
            <TaskTicker />
          </div>
        </header>

        <main className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
          <TaskList />
          <TaskDetail />
        </main>
      </div>
    </div>
  );
}

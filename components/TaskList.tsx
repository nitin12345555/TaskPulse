"use client";

import { useEffect } from "react";
import { selectVisibleTasks, useTaskStore } from "@/lib/store";
import { fetchTasks } from "@/lib/api";
import { loadTaskPage, saveTaskPage } from "@/lib/cache";
import { statusOptions, typeOptions, formatRelativeAge } from "@/lib/utils";

export function TaskList() {
  const tasks = useTaskStore(selectVisibleTasks);
  const page = useTaskStore((state) => state.page);
  const pageSize = useTaskStore((state) => state.pageSize);
  const total = useTaskStore((state) => state.total);
  const selectedTaskId = useTaskStore((state) => state.selectedTaskId);
  const loading = useTaskStore((state) => state.loading);
  const error = useTaskStore((state) => state.error);
  const filterStatus = useTaskStore((state) => state.filterStatus);
  const filterType = useTaskStore((state) => state.filterType);
  const search = useTaskStore((state) => state.search);
  const stale = useTaskStore((state) => state.stale);
  const setTasks = useTaskStore((state) => state.setTasks);
  const setLoading = useTaskStore((state) => state.setLoading);
  const setError = useTaskStore((state) => state.setError);
  const setStale = useTaskStore((state) => state.setStale);
  const setCachedDataLoaded = useTaskStore((state) => state.setCachedDataLoaded);
  const selectTask = useTaskStore((state) => state.selectTask);
  const setFilters = useTaskStore((state) => state.setFilters);
  const setPage = useTaskStore((state) => state.setPage);

  useEffect(() => {
    let mounted = true;
    async function hydrate() {
      setLoading(true);
      const cached = await loadTaskPage();
      if (cached && mounted) {
        setTasks(cached.tasks, cached.page, cached.pageSize, cached.total);
        setCachedDataLoaded(true);
        setStale(true);
      }
      try {
        const payload = await fetchTasks(page, pageSize);
        if (!mounted) return;
        setTasks(payload.items, payload.page, payload.pageSize, payload.total);
        setStale(false);
        await saveTaskPage(payload.items, payload.page, payload.pageSize, payload.total);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Unable to load tasks");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void hydrate();
    return () => {
      mounted = false;
    };
  }, [page, pageSize, setTasks, setLoading, setError, setStale, setCachedDataLoaded]);

  return (
    <section className="flex flex-col space-y-4 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-zinc-900">Task Feed</h2>
          <p className="text-sm text-zinc-600">Live list of annotation tasks.</p>
        </div>
      </div>

      {stale && <div className="rounded border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">Showing cached data; fresh data is loading.</div>}
      {loading && !stale && <div className="text-center text-sm text-zinc-600">Loading tasks…</div>}
      {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-900">{error}</div>}
      {!loading && tasks.length === 0 && <div className="text-center text-sm text-zinc-600">No tasks match the current filters.</div>}

      <div className="flex-grow">
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              role="button"
              onClick={() => selectTask(task.id)}
              className={`cursor-pointer rounded-lg border p-3 transition-all duration-200 ${
                selectedTaskId === task.id
                  ? "border-sky-500 bg-sky-50 ring-2 ring-sky-200"
                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-grow">
                  <div className="font-semibold text-zinc-800">{task.title}</div>
                  <div className="text-xs text-zinc-500">{task.id}</div>
                </div>
                <div className="mt-0.5 whitespace-nowrap text-right text-xs text-zinc-500">{formatRelativeAge(task.updatedAt)}</div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700">{task.type}</span>
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700">{task.status}</span>
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700">
                  Annotations: {task.annotationCount}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 pt-3 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
        <div>
          Page {page} of {Math.max(1, Math.ceil(total / pageSize))} ({total} tasks)
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="rounded-md border bg-white px-3 py-1.5 font-medium transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage(page + 1)}
            disabled={page * pageSize >= total}
            className="rounded-md border bg-white px-3 py-1.5 font-medium transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

"use client";

import create from "zustand";
import { Task, TaskStatus, TaskType } from "@/lib/types";

interface TaskState {
  tasks: Record<string, Task>;
  taskOrder: string[];
  page: number;
  pageSize: number;
  total: number;
  loading: boolean;
  error: string | null;
  selectedTaskId: string | null;
  filterStatus: TaskStatus | "all";
  filterType: TaskType | "all";
  search: string;
  stale: boolean;
  summary: string;
  summaryLoading: boolean;
  summaryError: string | null;
  cachedDataLoaded: boolean;
  setTasks: (tasks: Task[], page: number, pageSize: number, total: number) => void;
  updateTask: (task: Task) => void;
  updateTaskPartial: (id: string, patch: Partial<Task>) => void;
  incrementAnnotationCount: (id: string) => void;
  selectTask: (id: string | null) => void;
  setPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (opts: { status: TaskStatus | "all"; type: TaskType | "all"; search: string }) => void;
  setSummary: (summary: string) => void;
  appendSummary: (fragment: string) => void;
  setSummaryLoading: (loading: boolean) => void;
  setSummaryError: (error: string | null) => void;
  setStale: (stale: boolean) => void;
  setCachedDataLoaded: (loaded: boolean) => void;
}

const createTaskState = (set: any) => ({
  tasks: {} as Record<string, Task>,
  taskOrder: [] as string[],
  page: 1,
  pageSize: 20,
  total: 0,
  loading: false,
  error: null as string | null,
  selectedTaskId: null as string | null,
  filterStatus: "all" as TaskStatus | "all",
  filterType: "all" as TaskType | "all",
  search: "",
  stale: false,
  summary: "",
  summaryLoading: false,
  summaryError: null as string | null,
  cachedDataLoaded: false,
  setTasks: (tasks: Task[], page: number, pageSize: number, total: number) =>
    set((state: TaskState) => {
      const newMap = { ...state.tasks };
      tasks.forEach((task) => {
        newMap[task.id] = task;
      });
      return {
        tasks: newMap,
        taskOrder: tasks.map((task) => task.id),
        page,
        pageSize,
        total,
      };
    }),
  updateTask: (task: Task) =>
    set((state: TaskState) => ({
      tasks: { ...state.tasks, [task.id]: task },
      taskOrder: state.taskOrder.includes(task.id) ? state.taskOrder : [...state.taskOrder, task.id],
    })),
  updateTaskPartial: (id: string, patch: Partial<Task>) =>
    set((state: TaskState) => {
      const existing = state.tasks[id];
      if (!existing) return { tasks: state.tasks };
      return {
        tasks: { ...state.tasks, [id]: { ...existing, ...patch } },
      };
    }),
  incrementAnnotationCount: (id: string) =>
    set((state: TaskState) => {
      const existing = state.tasks[id];
      if (!existing) return { tasks: state.tasks };
      return {
        tasks: {
          ...state.tasks,
          [id]: { ...existing, annotationCount: existing.annotationCount + 1 },
        },
      };
    }),
  selectTask: (id: string | null) => set({ selectedTaskId: id }),
  setPage: (page: number) => set({ page }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setFilters: ({ status, type, search }: { status: TaskStatus | "all"; type: TaskType | "all"; search: string }) => set({ filterStatus: status, filterType: type, search }),
  setSummary: (summary: string) => set({ summary }),
  appendSummary: (fragment: string) => set((state: TaskState) => ({ summary: state.summary + fragment })),
  setSummaryLoading: (summaryLoading: boolean) => set({ summaryLoading }),
  setSummaryError: (summaryError: string | null) => set({ summaryError }),
  setStale: (stale: boolean) => set({ stale }),
  setCachedDataLoaded: (loaded: boolean) => set({ cachedDataLoaded: loaded }),
});

export const useTaskStore = create<TaskState>()(createTaskState);

export function selectVisibleTasks(state: TaskState) {
  return state.taskOrder
    .map((id) => state.tasks[id])
    .filter(Boolean)
    .filter((task) => (state.filterStatus === "all" ? true : task.status === state.filterStatus))
    .filter((task) => (state.filterType === "all" ? true : task.type === state.filterType))
    .filter((task) =>
      state.search
        ? task.title.toLowerCase().includes(state.search.toLowerCase()) || task.id.toLowerCase().includes(state.search.toLowerCase())
        : true
    )
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function selectSelectedTask(state: TaskState) {
  if (!state.selectedTaskId) return null;
  return state.tasks[state.selectedTaskId] ?? null;
}

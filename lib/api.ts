import { Task, TaskListResponse } from "@/lib/types";
import { normalizeTask } from "@/lib/normalize";

const API_HOST = process.env.NEXT_PUBLIC_API_BASE || "https://internal-hr-dashboard-sevices-production.up.railway.app";

function buildUrl(path: string, params: Record<string, string | number | undefined>) {
  const url = new URL(path, API_HOST);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });
  return url.toString();
}

export async function fetchTasks(page = 1, pageSize = 20) {
  const url = buildUrl("/api/tasks", { page, pageSize });
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to load tasks");
  const data = (await response.json()) as TaskListResponse;
  return {
    page: data.page,
    pageSize: data.pageSize,
    total: data.total,
    items: data.items.map(normalizeTask) as Task[],
  };
}

export async function fetchTaskById(id: string) {
  const url = buildUrl(`/api/tasks/${id}`, {});
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) throw new Error("Task not found");
    throw new Error("Failed to load task");
  }
  const raw = await response.json();
  return normalizeTask(raw);
}

export function taskSummaryStream(id: string) {
  const url = buildUrl(`/api/tasks/${id}/summary`, {});
  return new EventSource(url);
}

export function createTaskSocket(onMessage: (msg: unknown) => void) {
  const socket = new WebSocket(API_HOST.replace(/^http/, "ws") + "/ws");
  socket.addEventListener("message", (event) => {
    try {
      onMessage(JSON.parse(event.data));
    } catch {
      // ignore malformed updates
    }
  });
  return socket;
}

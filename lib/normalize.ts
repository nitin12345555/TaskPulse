import { Assignee, RawTask, Task, TaskStatus, TaskType } from "@/lib/types";

const typeMap: Record<string, TaskType> = {
  image: "image",
  audio: "audio",
  text: "text",
};

const statusMap: Record<string, TaskStatus> = {
  todo: "todo",
  todo_: "todo",
  in_progress: "in_progress",
  inprogress: "in_progress",
  inprogress_: "in_progress",
  "in progress": "in_progress",
  done: "done",
  qa: "qa",
  blocked: "blocked",
  blocked_: "blocked",
};

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeAssignee(value: unknown): Assignee | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  const id = normalizeString(candidate.id);
  const name = normalizeString(candidate.name);
  return id && name ? { id, name } : null;
}

function normalizeNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function normalizeUpdatedAt(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) return parsed;
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric;
  }
  return Date.now();
}

function normalizeMeta(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  return {};
}

export function normalizeTaskStatus(value: unknown): TaskStatus {
  const rawStatus = normalizeString(value).toLowerCase().replace(/\s+/g, "_");
  return statusMap[rawStatus] ?? "unknown";
}

export function normalizeTaskType(value: unknown): TaskType {
  const rawType = normalizeString(value).toLowerCase();
  return typeMap[rawType] ?? "unknown";
}

export function normalizeTask(raw: RawTask): Task {
  const id = normalizeString(raw.id);
  const title = normalizeString(raw.title) || "Untitled task";

  const type = normalizeTaskType(raw.type);
  const status = normalizeTaskStatus(raw.status);

  const assignee = normalizeAssignee(raw.assignee);

  const annotationCount = normalizeNumber(raw.annotationCount);
  const updatedAt = normalizeUpdatedAt(raw.updatedAt);
  const meta = normalizeMeta(raw.meta);

  return {
    id: id || `task-${Math.random().toString(16).slice(2)}`,
    title,
    type,
    status,
    assignee,
    annotationCount,
    updatedAt,
    meta,
  };
}

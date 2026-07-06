import { TaskStatus, TaskType } from "@/lib/types";

export const statusOptions: Array<{ label: string; value: TaskStatus | "all" }> = [
  { label: "All statuses", value: "all" },
  { label: "Todo", value: "todo" },
  { label: "In progress", value: "in_progress" },
  { label: "Done", value: "done" },
  { label: "Blocked", value: "blocked" },
  { label: "QA", value: "qa" },
];

export const typeOptions: Array<{ label: string; value: TaskType | "all" }> = [
  { label: "All types", value: "all" },
  { label: "Image", value: "image" },
  { label: "Audio", value: "audio" },
  { label: "Text", value: "text" },
  { label: "Unknown", value: "unknown" },
];

export function formatDate(timestamp: number) {
  if (!Number.isFinite(timestamp) || Number.isNaN(timestamp)) {
    return "Unknown date";
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function formatRelativeAge(timestamp: number) {
  if (!Number.isFinite(timestamp) || Number.isNaN(timestamp)) {
    return "Unknown age";
  }
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

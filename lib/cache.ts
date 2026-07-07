import localforage from "localforage";
import { Task } from "@/lib/types";
const taskStore = localforage.createInstance({
  name: "task-cache",
  storeName: "tasks",
});
export async function saveTaskPage(tasks: Task[], page: number, pageSize: number, total: number) {
  await taskStore.setItem("cachedPage", { tasks, page, pageSize, total, savedAt: Date.now() });
}
export async function loadTaskPage() {
  const stored = await taskStore.getItem<{ tasks: Task[]; page: number; pageSize: number; total: number; savedAt: number }>("cachedPage");
  return stored ?? null;
}

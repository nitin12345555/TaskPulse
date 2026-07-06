export type TaskType = "image" | "audio" | "text" | "unknown";
export type TaskStatus = "todo" | "in_progress" | "done" | "blocked" | "qa" | "unknown";

export interface Assignee {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  assignee: Assignee | null;
  annotationCount: number;
  updatedAt: number;
  meta: Record<string, unknown>;
}

export interface RawTask {
  id?: unknown;
  title?: unknown;
  type?: unknown;
  status?: unknown;
  assignee?: unknown;
  annotationCount?: unknown;
  updatedAt?: unknown;
  meta?: unknown;
}

export interface TaskListResponse {
  page: number;
  pageSize: number;
  total: number;
  items: RawTask[];
}

export interface TaskEventUpdate {
  kind: "task.updated";
  payload: {
    id: string;
    status: string;
    updatedAt: number;
  };
}

export interface TaskEventAssigned {
  kind: "task.assigned";
  payload: {
    id: string;
    assignee: Assignee | null;
  };
}

export interface TaskEventAnnotationCreated {
  kind: "annotation.created";
  payload: {
    taskId: string;
    by: string;
    at: number;
  };
}

export type TaskEvent = TaskEventUpdate | TaskEventAssigned | TaskEventAnnotationCreated;

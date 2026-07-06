"use client";

import { useEffect, useRef } from "react";
import { createTaskSocket } from "@/lib/api";
import { useTaskStore } from "@/lib/store";
import { TaskEvent } from "@/lib/types";
import { normalizeTaskStatus } from "@/lib/normalize";

export function useTaskFeed() {
  const updateTaskPartial = useTaskStore((state) => state.updateTaskPartial);
  const incrementAnnotationCount = useTaskStore((state) => state.incrementAnnotationCount);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<number | null>(null);
  const retryCount = useRef(0);

  useEffect(() => {
    let active = true;

    const scheduleReconnect = () => {
      if (!active) return;
      if (reconnectTimer.current) window.clearTimeout(reconnectTimer.current);
      const delay = Math.min(2000 * 2 ** retryCount.current, 30000);
      reconnectTimer.current = window.setTimeout(() => {
        retryCount.current += 1;
        connect();
      }, delay);
    };

    const connect = () => {
      if (!active) return;
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      const socket = createTaskSocket((message) => {
        const event = message as TaskEvent;
        if (!event?.kind) return;

        if (event.kind === "task.updated") {
          updateTaskPartial(event.payload.id, {
            status: normalizeTaskStatus(event.payload.status),
            updatedAt: event.payload.updatedAt,
          });
        }

        if (event.kind === "task.assigned") {
          updateTaskPartial(event.payload.id, { assignee: event.payload.assignee });
        }

        if (event.kind === "annotation.created") {
          const currentTasks = useTaskStore.getState().tasks;
          if (currentTasks[event.payload.taskId]) {
            incrementAnnotationCount(event.payload.taskId);
          }
        }
      });

      socketRef.current = socket;

      socket.addEventListener("open", () => {
        retryCount.current = 0;
      });

      socket.addEventListener("close", () => {
        if (!active) return;
        scheduleReconnect();
      });

      socket.addEventListener("error", () => {
        if (!active) return;
        scheduleReconnect();
      });
    };

    connect();

    return () => {
      active = false;
      if (reconnectTimer.current) window.clearTimeout(reconnectTimer.current);
      if (socketRef.current) socketRef.current.close();
    };
  }, [updateTaskPartial, incrementAnnotationCount]);
}

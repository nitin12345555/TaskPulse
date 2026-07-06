"use client";

import { useEffect, useRef } from "react";
import { taskSummaryStream } from "@/lib/api";
import { useTaskStore } from "@/lib/store";

export function useSummaryStream(taskId: string | null) {
  const setSummary = useTaskStore((state) => state.setSummary);
  const appendSummary = useTaskStore((state) => state.appendSummary);
  const setSummaryLoading = useTaskStore((state) => state.setSummaryLoading);
  const setSummaryError = useTaskStore((state) => state.setSummaryError);
  const eventSourceRef = useRef<EventSource | null>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (!taskId) return;
    finishedRef.current = false;
    setSummary("");
    setSummaryError(null);
    setSummaryLoading(true);

    const eventSource = taskSummaryStream(taskId);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      if (event.data === "Done") {
        finishedRef.current = true;
        setSummaryLoading(false);
        eventSource.close();
      } else {
        appendSummary(event.data);
      }
    };

    eventSource.onerror = () => {
      if (!finishedRef.current) {
        setSummaryError("Summary stream failed.");
      }
      setSummaryLoading(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [taskId, setSummary, appendSummary, setSummaryLoading, setSummaryError]);
}

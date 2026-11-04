"use client";

import { useEffect, useState } from "react";
import type { LiveStatus } from "./live";

/** The live status from /api/live, asked on load and then every 2 minutes. Starts from `initial`. */
export function useLive(initial: LiveStatus = { live: false, videoId: "" }) {
  const [status, setStatus] = useState(initial);
  useEffect(() => {
    let stop = false;
    const ask = () =>
      fetch("/api/live")
        .then((r) => (r.ok ? r.json() : null))
        .then((s: LiveStatus | null) => !stop && s && setStatus(s))
        .catch(() => {});
    ask();
    const timer = setInterval(ask, 120_000);
    return () => {
      stop = true;
      clearInterval(timer);
    };
  }, []);
  return status;
}

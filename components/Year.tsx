"use client";

import { useEffect, useState } from "react";

const BUILD = Number(process.env.BUILD_YEAR) || 2026;

/** Current year for the © line. Static HTML carries the build year; after load the browser swaps in today's year. */
export default function Year() {
  const [y, setY] = useState(BUILD);
  useEffect(() => {
    setY(new Date().getFullYear());
  }, []);
  return <>{y}</>;
}

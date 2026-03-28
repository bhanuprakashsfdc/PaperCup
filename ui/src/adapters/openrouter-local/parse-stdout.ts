import type { TranscriptEntry } from "../types";

export function parseOpenRouterStdoutLine(line: string, ts: string): TranscriptEntry[] {
  return [{ kind: "stdout", ts, text: line }];
}

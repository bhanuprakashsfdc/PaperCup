import type { TranscriptEntry } from "../types";

export function parseKiloStdoutLine(line: string, ts: string): TranscriptEntry[] {
  return [{ kind: "stdout", ts, text: line }];
}

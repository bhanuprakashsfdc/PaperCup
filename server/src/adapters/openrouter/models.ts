import type { AdapterModel } from "../types.js";

const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";
const MODELS_CACHE_TTL_MS = 60_000;

let cachedModels: { expiresAt: number; models: AdapterModel[] } | null = null;

export async function listOpenRouterModels(): Promise<AdapterModel[]> {
  const now = Date.now();
  if (cachedModels && cachedModels.expiresAt > now) {
    return cachedModels.models;
  }

  try {
    const res = await fetch(OPENROUTER_MODELS_URL, {
      headers: { "content-type": "application/json" },
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) return cachedModels?.models ?? [];

    const body = (await res.json()) as {
      data?: Array<{
        id: string;
        name?: string;
        pricing?: { prompt?: string; completion?: string };
      }>;
    };

    const models: AdapterModel[] = (body.data ?? [])
      .filter((m) => m.id && m.name)
      .map((m) => {
        const prompt = parseFloat(m.pricing?.prompt ?? "1");
        const completion = parseFloat(m.pricing?.completion ?? "1");
        const isFree = prompt === 0 && completion === 0;
        const name = m.name!.replace(/\s*\(free\)\s*$/i, "");
        const label = isFree ? `${name} (free)` : name;
        return { id: m.id, label };
      })
      .sort((a, b) =>
        a.id.localeCompare(b.id, "en", { numeric: true, sensitivity: "base" }),
      );

    cachedModels = { expiresAt: now + MODELS_CACHE_TTL_MS, models };
    return models;
  } catch {
    return cachedModels?.models ?? [];
  }
}

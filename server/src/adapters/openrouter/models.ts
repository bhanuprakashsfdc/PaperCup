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
      data?: Array<{ id: string; name?: string }>;
    };

    const models: AdapterModel[] = (body.data ?? [])
      .filter((m) => m.id && m.name)
      .map((m) => ({ id: m.id, label: m.name! }))
      .sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true, sensitivity: "base" }));

    cachedModels = { expiresAt: now + MODELS_CACHE_TTL_MS, models };
    return models;
  } catch {
    return cachedModels?.models ?? [];
  }
}

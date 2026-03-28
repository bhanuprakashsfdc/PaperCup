import type { AdapterModel } from "../types.js";
import { listOpenRouterModels } from "../openrouter/models.js";

const KILO_BASE_URL = "https://api.kilocode.ai/v1";
const MODELS_CACHE_TTL_MS = 60_000;

const kiloCache = new Map<string, { expiresAt: number; models: AdapterModel[] }>();

export async function listKiloModels(): Promise<AdapterModel[]> {
  const now = Date.now();
  const cached = kiloCache.get("default");
  if (cached && cached.expiresAt > now) return cached.models;

  // Try Kilo API first
  try {
    const res = await fetch(`${KILO_BASE_URL}/models`, {
      headers: { "content-type": "application/json" },
      signal: AbortSignal.timeout(10_000),
    });

    if (res.ok) {
      const body = (await res.json()) as {
        data?: Array<{
          id: string;
          name?: string;
          description?: string;
          pricing?: { prompt?: string; completion?: string };
        }>;
      };
      const models: AdapterModel[] = (body.data ?? [])
        .filter((m) => m.id)
        .map((m) => {
          const prompt = parseFloat(m.pricing?.prompt ?? "1");
          const completion = parseFloat(m.pricing?.completion ?? "1");
          const isFree = prompt === 0 && completion === 0;
          const name = (m.name || m.description || m.id).replace(/\s*\(free\)\s*$/i, "");
          return {
            id: m.id,
            label: isFree ? `${name} (free)` : name,
          };
        })
        .sort((a, b) =>
          a.id.localeCompare(b.id, "en", { numeric: true, sensitivity: "base" }),
        );
      if (models.length > 0) {
        kiloCache.set("default", { expiresAt: now + MODELS_CACHE_TTL_MS, models });
        return models;
      }
    }
  } catch {
    // fall through to OpenRouter
  }

  // Kilo routes through OpenRouter — use its model list as fallback
  try {
    const orModels = await listOpenRouterModels();
    if (orModels.length > 0) {
      kiloCache.set("default", { expiresAt: now + MODELS_CACHE_TTL_MS, models: orModels });
      return orModels;
    }
  } catch {
    // fall through
  }

  return [];
}

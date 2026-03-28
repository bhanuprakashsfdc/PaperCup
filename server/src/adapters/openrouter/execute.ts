import type { AdapterExecutionContext, AdapterExecutionResult } from "../types.js";
import { asString, parseObject } from "../utils.js";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

export async function execute(ctx: AdapterExecutionContext): Promise<AdapterExecutionResult> {
  const { config, runId, agent, context } = ctx;

  const apiKey = asString(config.apiKey, "");
  if (!apiKey) throw new Error("OpenRouter adapter missing apiKey");

  const model = asString(config.model, "");
  if (!model) throw new Error("OpenRouter adapter missing model");

  const timeoutMs = 120_000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const systemPrompt = asString(config.promptTemplate, "") || `You are ${agent.name}, an AI agent.`;
  const userMessage = typeof context === "string" ? context : JSON.stringify(context);

  try {
    const res = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error(`OpenRouter API failed (${res.status}): ${errBody.slice(0, 300)}`);
    }

    const body = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };

    const content = body.choices?.[0]?.message?.content ?? "";

    return {
      exitCode: 0,
      signal: null,
      timedOut: false,
      summary: content.slice(0, 500),
      usage: {
        inputTokens: body.usage?.prompt_tokens ?? 0,
        outputTokens: body.usage?.completion_tokens ?? 0,
      },
    };
  } finally {
    clearTimeout(timer);
  }
}

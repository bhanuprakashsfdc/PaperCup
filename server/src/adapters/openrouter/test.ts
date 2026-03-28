import type {
  AdapterEnvironmentCheck,
  AdapterEnvironmentTestContext,
  AdapterEnvironmentTestResult,
} from "../types.js";
import { asString, parseObject } from "../utils.js";

function summarizeStatus(checks: AdapterEnvironmentCheck[]): AdapterEnvironmentTestResult["status"] {
  if (checks.some((check) => check.level === "error")) return "fail";
  if (checks.some((check) => check.level === "warn")) return "warn";
  return "pass";
}

export async function testEnvironment(
  ctx: AdapterEnvironmentTestContext,
): Promise<AdapterEnvironmentTestResult> {
  const checks: AdapterEnvironmentCheck[] = [];
  const config = parseObject(ctx.config);
  const apiKey = asString(config.apiKey, "");
  const model = asString(config.model, "");

  if (!apiKey) {
    checks.push({
      code: "openrouter_api_key_missing",
      level: "error",
      message: "OpenRouter API key is not configured.",
      hint: "Set adapterConfig.apiKey to your OpenRouter API key.",
    });
  } else {
    checks.push({
      code: "openrouter_api_key_set",
      level: "info",
      message: "OpenRouter API key is configured.",
    });
  }

  if (!model) {
    checks.push({
      code: "openrouter_model_missing",
      level: "warn",
      message: "No model specified. Set adapterConfig.model to an OpenRouter model ID.",
      hint: "Visit https://openrouter.ai/models for available models.",
    });
  } else {
    checks.push({
      code: "openrouter_model_set",
      level: "info",
      message: `Configured model: ${model}`,
    });
  }

  if (apiKey) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/models", {
        headers: { authorization: `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(5_000),
      });
      if (res.ok) {
        checks.push({
          code: "openrouter_api_reachable",
          level: "info",
          message: "OpenRouter API is reachable and key is valid.",
        });
      } else {
        checks.push({
          code: "openrouter_api_error",
          level: "warn",
          message: `OpenRouter API returned HTTP ${res.status}.`,
          hint: "Verify your API key at https://openrouter.ai/keys",
        });
      }
    } catch (err) {
      checks.push({
        code: "openrouter_api_unreachable",
        level: "warn",
        message: err instanceof Error ? err.message : "Could not reach OpenRouter API.",
        hint: "Check network connectivity to openrouter.ai.",
      });
    }
  }

  return {
    adapterType: ctx.adapterType,
    status: summarizeStatus(checks),
    checks,
    testedAt: new Date().toISOString(),
  };
}

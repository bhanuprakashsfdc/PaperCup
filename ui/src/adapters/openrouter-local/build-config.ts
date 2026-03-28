import type { CreateConfigValues } from "../../components/AgentConfigForm";

export function buildOpenRouterConfig(v: CreateConfigValues): Record<string, unknown> {
  const ac: Record<string, unknown> = {};
  const apiKey = (v as any).openrouterApiKey;
  if (apiKey) ac.apiKey = apiKey;
  if (v.model) ac.model = v.model;
  if (v.promptTemplate) ac.promptTemplate = v.promptTemplate;
  const maxTokens = (v as any).openrouterMaxTokens;
  if (maxTokens != null && maxTokens !== "") ac.maxTokens = Number(maxTokens);
  const temperature = (v as any).openrouterTemperature;
  if (temperature != null && temperature !== "") ac.temperature = Number(temperature);
  return ac;
}

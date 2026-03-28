import type { UIAdapterModule } from "../types";
import { parseOpenRouterStdoutLine } from "./parse-stdout";
import { OpenRouterConfigFields } from "./config-fields";
import { buildOpenRouterConfig } from "./build-config";

export const openRouterLocalUIAdapter: UIAdapterModule = {
  type: "openrouter_local",
  label: "OpenRouter",
  parseStdoutLine: parseOpenRouterStdoutLine,
  ConfigFields: OpenRouterConfigFields,
  buildAdapterConfig: buildOpenRouterConfig,
};

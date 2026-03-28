import type { ServerAdapterModule } from "../types.js";
import { execute } from "./execute.js";
import { testEnvironment } from "./test.js";
import { listOpenRouterModels } from "./models.js";

export const openrouterAdapter: ServerAdapterModule = {
  type: "openrouter_local",
  execute,
  testEnvironment,
  models: [],
  listModels: listOpenRouterModels,
  agentConfigurationDoc: `# openrouter_local agent configuration

Adapter: openrouter_local

Core fields:
- apiKey (string, required): OpenRouter API key (https://openrouter.ai/keys)
- model (string, required): OpenRouter model ID (e.g. openai/gpt-4o, anthropic/claude-sonnet-4)
- promptTemplate (string, optional): system prompt for the agent
- maxTokens (number, optional): maximum tokens in the response
- temperature (number, optional): sampling temperature (0-2)

Notes:
- OpenRouter provides access to 200+ models from multiple providers via a single API.
- Models are discovered dynamically from the OpenRouter API.
- API keys are stored securely via the adapter config env bindings.
`,
};

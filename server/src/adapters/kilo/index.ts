import type { ServerAdapterModule } from "../types.js";
import { execute } from "./execute.js";
import { testEnvironment } from "./test.js";
import { listKiloModels } from "./models.js";

export const kiloAdapter: ServerAdapterModule = {
  type: "kilo_local",
  execute,
  testEnvironment,
  models: [],
  listModels: listKiloModels,
  agentConfigurationDoc: `# kilo_local agent configuration

Adapter: kilo_local

Core fields:
- apiKey (string, required): Kilo API key (https://kilocode.ai)
- model (string, required): Kilo model ID
- promptTemplate (string, optional): system prompt for the agent
- maxTokens (number, optional): maximum tokens in the response
- temperature (number, optional): sampling temperature (0-2)

Notes:
- Kilo provides access to AI coding models via an OpenAI-compatible API.
- Models are discovered dynamically from the Kilo API.
- API keys are stored securely via the adapter config env bindings.
`,
};

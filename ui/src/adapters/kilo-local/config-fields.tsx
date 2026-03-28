import type { AdapterConfigFieldsProps } from "../types";
import {
  Field,
  DraftInput,
} from "../../components/agent-config-primitives";

const inputClass =
  "w-full rounded-md border border-border px-2.5 py-1.5 bg-transparent outline-none text-sm font-mono placeholder:text-muted-foreground/40";

export function KiloConfigFields({
  isCreate,
  values,
  set,
  config,
  eff,
  mark,
}: AdapterConfigFieldsProps) {
  return (
    <>
      <Field label="API Key" hint="Your Kilo API key from https://kilocode.ai">
        <DraftInput
          value={
            isCreate
              ? (values as any)?.kiloApiKey ?? ""
              : eff("adapterConfig", "apiKey", String(config.apiKey ?? ""))
          }
          onCommit={(v) =>
            isCreate
              ? set!({ kiloApiKey: v } as any)
              : mark("adapterConfig", "apiKey", v || undefined)
          }
          immediate
          className={inputClass}
          placeholder="kilo-..."
          type="password"
        />
      </Field>
      <Field label="Max Tokens" hint="Maximum tokens in the model response. Leave empty for model default.">
        <DraftInput
          value={
            isCreate
              ? String((values as any)?.kiloMaxTokens ?? "")
              : eff("adapterConfig", "maxTokens", String(config.maxTokens ?? ""))
          }
          onCommit={(v) => {
            const num = v ? Number(v) : undefined;
            isCreate
              ? set!({ kiloMaxTokens: num } as any)
              : mark("adapterConfig", "maxTokens", num)
          }}
          immediate
          className={inputClass}
          placeholder="4096"
          type="number"
        />
      </Field>
      <Field label="Temperature" hint="Sampling temperature (0-2). Leave empty for model default.">
        <DraftInput
          value={
            isCreate
              ? String((values as any)?.kiloTemperature ?? "")
              : eff("adapterConfig", "temperature", String(config.temperature ?? ""))
          }
          onCommit={(v) => {
            const num = v ? Number(v) : undefined;
            isCreate
              ? set!({ kiloTemperature: num } as any)
              : mark("adapterConfig", "temperature", num)
          }}
          immediate
          className={inputClass}
          placeholder="0.7"
          type="number"
        />
      </Field>
    </>
  );
}

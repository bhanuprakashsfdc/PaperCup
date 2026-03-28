import type { UIAdapterModule } from "../types";
import { parseKiloStdoutLine } from "./parse-stdout";
import { KiloConfigFields } from "./config-fields";
import { buildKiloConfig } from "./build-config";

export const kiloLocalUIAdapter: UIAdapterModule = {
  type: "kilo_local",
  label: "Kilo Code",
  parseStdoutLine: parseKiloStdoutLine,
  ConfigFields: KiloConfigFields,
  buildAdapterConfig: buildKiloConfig,
};

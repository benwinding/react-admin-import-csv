import { ParseConfig } from "papaparse";

export interface ImportConfig {
  logging?: boolean;
  disableImportNew?: boolean;
  disableImportOverwrite?: boolean;
  parseConfig?: ParseConfig;
  preCommitCallback?: (action: "create" | "overwrite", values: any[]) => any[];
}

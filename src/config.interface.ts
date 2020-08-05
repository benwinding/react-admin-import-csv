import { ParseConfig } from "papaparse";

export interface ImportConfig {
  logging?: boolean;
  reportCallback?: () => any[];
  disableImportNew?: boolean;
  disableImportOverwrite?: boolean;
  parseConfig?: ParseConfig;
  preCommitCallback?: (action: "create" | "overwrite", values: any[]) => any[];
};

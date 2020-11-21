import { ParseConfig } from "papaparse";

export interface ImportConfig {
  logging?: boolean;
  parseConfig?: ParseConfig;
  disableImportNew?: boolean;
  disableImportOverwrite?: boolean;
  preCommitCallback?: PrecommitCallback;
  postCommitCallback?: ErrorCallback;
  validateRow?: ValidateRowFunction;
};

export type PrecommitCallback = (action: "create" | "overwrite", values: any[]) => any[];
export type ValidateRowFunction = (csvRowItem: any, index?: any, allItems?: any[]) => Promise<void>;
export type ErrorCallback = (error: any) => void;
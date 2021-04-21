import { ParseConfig } from "papaparse";

export interface ImportConfig {
  logging?: boolean;
  parseConfig?: ParseConfig;
  disableImportNew?: boolean;
  disableImportOverwrite?: boolean;
  disableCollidingIdCheck?: boolean;
  preCommitCallback?: PrecommitCallback;
  postCommitCallback?: ErrorCallback;
  transformRows?: (csvRows: any[]) => Promise<any[]>;
  validateRow?: ValidateRowFunction;
  postValidateCallback?: PostValidateCallback;
};

export type PrecommitCallback = (action: "create" | "overwrite", values: any[]) => Promise<any[]>;
export type ValidateRowFunction = (csvRowItem: any, index?: any, allItems?: any[]) => Promise<any>;
export type PostValidateCallback = (errors: any, csvItems: any[]) => Promise<void>;
export type ErrorCallback = (error: any) => void;

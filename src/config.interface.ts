import { ParseConfig } from "papaparse";

export interface ImportConfig {
  // Enable logging
  logging?: boolean;
  // Disable the attempt to use "createMany", will instead just use "create" calls
  disableCreateMany?: boolean,
  // Disable the attempt to use "updateMany", will instead just use "update" calls
  disableUpdateMany?: boolean,
  // Disable the attempt to use "getMany", will instead just use "getOne" calls
  disableGetMany?: boolean,
  // Disable "import new" button
  disableImportNew?: boolean;
  // Disable "import overwrite" button
  disableImportOverwrite?: boolean;
  // A function to translate the CSV rows on import
  preCommitCallback?: PrecommitCallback;
  // A function to handle row errors after import
  postCommitCallback?: ErrorCallback;
  // Transform rows before anything is sent to dataprovider
  transformRows?: (csvRows: any[]) => Promise<any[]>;
  // Async function to Validate a row, reject the promise if it's not valid
  validateRow?: ValidateRowFunction;
  // Any option from the "papaparse" library, for all options see: https://www.papaparse.com/docs#config
  parseConfig?: ParseConfig,
};

export type PrecommitCallback = (action: "create" | "overwrite", values: any[]) => Promise<any[]>;
export type ValidateRowFunction = (csvRowItem: any, index?: any, allItems?: any[]) => Promise<void>;
export type ErrorCallback = (error: any) => void;

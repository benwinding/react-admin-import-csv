import { Translate, DataProvider } from "ra-core";
import { processCsvFile } from "./csv-extractor";
import { SimpleLogger } from "./SimpleLogger";
import { ValidateRowFunction } from "./config.interface";

function makeLogger(logging: boolean) {
  const logger = new SimpleLogger("import-controller", true);
  logger.setEnabled(logging);
  return logger;
}

export async function GetIdsColliding(
  logging: boolean,
  translate: Translate,
  dataProvider: DataProvider,
  csvValues: any[],
  resourceName: string,
): Promise<string[]> {
  const logger = makeLogger(logging);
  const hasIds = csvValues.some((v) => v.id);
  if (!hasIds) {
    return [];
  }
  try {
    const ids: string[] = csvValues.filter(v => !!v.id).map((v) => v.id+'');
    const recordsColliding = await dataProvider.getMany(resourceName, {
      ids: ids,
    });
    const recordIdsColliding = recordsColliding.data.map((r) => r.id + '' as string);
    return recordIdsColliding;
  } catch (error) {
    logger.error("GetIdsColliding", { csvValues }, error);
    throw translate("csv.parsing.collidingIds");
  }
}

export async function CheckCSVValidation(
  logging: boolean,
  translate: Translate,
  csvValues: any[],
  validateRow: ValidateRowFunction
): Promise<void> {
  const logger = makeLogger(logging);
  if (!validateRow) {
    return;
  }
  try {
    await Promise.all(csvValues.map((v) => validateRow(v)));
  } catch (error) {
    logger.error("onFileAdded", { csvValues }, error);
    throw translate("csv.parsing.failedValidateRow");
  }
}

export async function GetCSVItems(
  logging: boolean,
  translate: Translate,
  file: File,
  parseConfig: any,
): Promise<any[]> {
  const logger = makeLogger(logging);
  let csvValues: any[];
  try {
    const csvValues = await processCsvFile(file, parseConfig);
    return csvValues;
  } catch (error) {
    logger.error("onFileAdded", { csvValues }, error);
    throw translate("csv.parsing.invalidCsvDocument");
  }
}

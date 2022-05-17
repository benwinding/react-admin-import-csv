import { Translate, DataProvider, Identifier } from "ra-core";
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
  disableGetMany: boolean | undefined,
): Promise<Identifier[]> {
  const logger = makeLogger(logging);
  const hasIds = csvValues.some((v) => v.id);
  if (!hasIds) {
    return [];
  }
  try {
    const csvIds: Identifier[] = csvValues.filter(v => !!v.id).map((v) => v.id);
    const recordsIdsColliding = await (disableGetMany 
      ? GetIdsCollidingGetSingle( logging, translate, dataProvider, csvIds, resourceName )
      : GetIdsCollidingGetMany( logging, translate, dataProvider, csvIds, resourceName )
    );
    return recordsIdsColliding;
  } catch (error) {
    logger.error("GetIdsColliding", { csvValues }, error);
    throw translate("csv.parsing.collidingIds");
  }
}

export async function GetIdsCollidingGetSingle(
  logging: boolean,
  translate: Translate,
  dataProvider: DataProvider,
  csvIds: Identifier[],
  resourceName: string,
): Promise<Identifier[]> {
  const logger = makeLogger(logging);
  try {
    const recordsColliding = await Promise.all(csvIds.map(id => IsIdColliding(
      dataProvider,
      id,
      resourceName,
    )));
    const recordIdsColliding = recordsColliding.filter(Boolean) as Identifier[];
    return recordIdsColliding;
  } catch (error) {
    logger.error("GetIdsCollidingGetSingle", { csvIds }, error);
    throw translate("csv.parsing.collidingIds");
  }
}

export async function IsIdColliding(
  dataProvider: DataProvider,
  id: Identifier,
  resourceName: string,
) {
  return dataProvider.getOne(resourceName, {id})
    .then(_ => undefined)
    .catch(_ => id);
}

export async function GetIdsCollidingGetMany(
  logging: boolean,
  translate: Translate,
  dataProvider: DataProvider,
  csvIds: Identifier[],
  resourceName: string,
): Promise<Identifier[]> {
  const logger = makeLogger(logging);
  try {
    const recordsColliding = await dataProvider.getMany(resourceName, {
      ids: csvIds,
    });
    const recordIdsColliding = recordsColliding.data.map((r) => r.id);
    return recordIdsColliding;
  } catch (error) {
    logger.error("GetIdsCollidingGetMany", { csvIds }, error);
    throw translate("csv.parsing.collidingIds");
  }
}

export async function CheckCSVValidation(
  logging: boolean,
  translate: Translate,
  csvValues: any[],
  validateRow?: ValidateRowFunction
): Promise<void> {
  const logger = makeLogger(logging);
  if (!validateRow) {
    return;
  }
  try {
    await Promise.all(csvValues.map(validateRow));
  } catch (error) {
    logger.error("CheckCSVValidation", { csvValues }, error);
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
  let csvValues: any[] | undefined;
  try {
    csvValues = await processCsvFile(file, parseConfig);
    return csvValues || [];
  } catch (error) {
    logger.error("GetCSVItems", { csvValues }, error);
    throw translate("csv.parsing.invalidCsvDocument");
  }
}

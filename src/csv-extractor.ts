import { parse as convertFromCSV, ParseConfig } from "papaparse";
import lensPath from "ramda/src/lensPath";
import over from "ramda/src/over";

const setObjectValue = (object: any, path: string, value: any): any => {
  const lensPathFunction = lensPath(path.split("."));
  return over(lensPathFunction, () => value, object || {});
};

export async function processCsvFile(
  file: File | any,
  parseConfig: ParseConfig = {}
) {
  if (!file) {
    return;
  }
  const csvData = await getCsvData(file, parseConfig);
  return processCsvData(csvData);
}

export async function getCsvData(
  file: File | any,
  parseConfig: ParseConfig = {}
) {
  return new Promise<string[][]>((resolve, reject) =>
    convertFromCSV(file, {
      ...parseConfig,
      delimiter: ",",
      skipEmptyLines: true,
      complete: result => resolve(result.data),
      error: error => reject(error)
    })
  );
}

export function processCsvData(data: string[][]): any[] {
  const topRowKeys: string[] = data[0];

  const dataRows = data.slice(1).map(row => {
    let value: any = {};

    topRowKeys.forEach((key, index) => {
      value = setObjectValue(value, key, row[index]);
    });

    return value;
  });

  return dataRows;
}

import { parse as convertFromCSV } from "papaparse";

export async function processCsvFile(file: File | any) {
  if (!file) {
    return;
  }
  const csvData = await getCsvData(file);
  return processCsvData(csvData);
}

export async function getCsvData(file: File | any) {
  return new Promise<string[][]>((resolve, reject) =>
    convertFromCSV(file, {
      delimiter: ",",
      skipEmptyLines: true,
      complete: result => resolve(result.data),
      error: error => reject(error)
    })
  );
}

export function processCsvData(data: string[][]): Object[] {
  const topRowKeys: string[] = data[0];

  const dataRows = data.slice(1).map(row => {
    const value: any = {};

    topRowKeys.forEach((key, index) => {
      value[key] = row[index];
    });

    return value;
  });

  return dataRows;
}

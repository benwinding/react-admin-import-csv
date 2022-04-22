import { processCsvData, getCsvData, processCsvFile } from "./csv-extractor";
import * as fs from "fs";
import * as path from "path";

function getFile(relPath: string): fs.ReadStream {
  const testCsvPath = path.join(__dirname, relPath)
  const csvFile = fs.createReadStream(testCsvPath)
  return csvFile;
}

describe("csv extractor", () => {
  test("processCsvData", () => {
    const output = processCsvData([
      ["id", "title"],
      ["1", "One"],
      ["2", "Two"]
    ]);
    expect(output).toHaveLength(2)
    expect(output[0]['id']).toBe("1")
  });

  test("getCsvData test1.csv", async () => {
    const file = getFile('../test-csvs/test1.csv')
    const data = await getCsvData(file)
    expect(data).toHaveLength(6)
  });

  test("getCsvData test2.csv", async () => {
    const file = getFile('../test-csvs/test2.csv')
    const data = await getCsvData(file)
    expect(data).toHaveLength(6)
  });

  test("processCsvFile test1.csv", async () => {
    const file = getFile('../test-csvs/test1.csv')
    const data = await processCsvFile(file)
    expect(data).toHaveLength(5)
  });

  test("process csv data with nested object", () => {
    const output = processCsvData([
      ["id", "item.title"],
      ["1", "One"],
      ["2", "Two"]
    ]);
    expect(output).toHaveLength(2)
    expect(output[0].id).toBe("1")
    expect(output[0].item.title).toBe("One")
  });

  test("process csv data with tab delimiter", async () => {
    const file = getFile('../test-csvs/test1.tsv')
    const output = await getCsvData(file, {
      delimiter: '\t',
    });
    expect(output).toHaveLength(6)
  });
});

describe('processCsvData', () => {
  test('should parse with blank column', () => {
    // papaparse returns null for 0-char columns
    const testData = [[null, "test"], [null, "value"]];
    expect(processCsvData(testData)).toEqual([{"": null, "test": "value"}]);
  })
});

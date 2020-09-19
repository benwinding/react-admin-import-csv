import { processCsvData, getCsvData, processCsvFile } from "./csv-extractor";

import * as Uploader from "./uploader";

import * as fs from "fs";
import * as path from "path";

function getFile(relPath: string): fs.ReadStream {
  const testCsvPath = path.join(__dirname, relPath)
  const csvFile = fs.createReadStream(testCsvPath)
  return csvFile;
}

const success = (res, params) => Promise.resolve(params.data)
const failure = (res, params) => (
  params.data.id.match(/wqwq/) ?
    Promise.reject("wqwq is bad") :
    Promise.resolve(params.data))

const defaults = {
  resource: "dummy",
  create: {
    success,
    failure
  },
  update: {
    success,
    failure
  }
}

const expectOperation = (method, onMethod, onReport) => {

  const dataProvider = { [ method ] : onMethod}

  return processCsvFile(getFile('../test-csvs/test1.csv'))
    .then(values => (
      Uploader[method](
        dataProvider,
        defaults.resource,
        values,
        onReport)))
}

const expectCreate = (onCreate, onReport = null) => expectOperation('create', onCreate, onReport)

const expectUpdate = (onUpdate, onReport = null) => expectOperation('update', onUpdate, onReport)

describe("import csv button", () => {
  describe("with reporting", () => {
    // test("happy path create", done => {
    //   expectCreate(
    //     defaults.create.success,
    //     report => {
    //        expect(report).toHaveLength(5)
    //        expect(report.filter(r => r.success)).toHaveLength(5)
    //        done()
    //     })
    // });
    
    // test("happy path update", done => {
    //   expectUpdate(
    //     defaults.update.success,
    //     report => {
    //        expect(report).toHaveLength(5)
    //        expect(report.filter(r => r.success)).toHaveLength(5)
    //        done()
    //     })
    // })
    // test("server error path create", done => {
    //   expectCreate(
    //     defaults.create.failure,
    //     report => {
    //        expect(report.filter(r => r.success)).toHaveLength(4)
    //        expect(report.filter(r => !r.success)).toHaveLength(1)
    //        done()
    //     })
    // })

    // test("server error path update", done => {
    //   expectUpdate(
    //     defaults.update.failure,
    //     report => {
    //        expect(report.filter(r => r.success)).toHaveLength(4)
    //        expect(report.filter(r => !r.success)).toHaveLength(1)
    //        done()
    //     })
    
    // })
  })

  describe("without reporting", () => {

    // test("happy path create", () => expectCreate(defaults.create.success))

    // test("happy path update", () => expectUpdate(defaults.update.success))

    test("server error path create", done => {
      expectCreate(defaults.create.failure)
        .catch(() =>  done())
    })
    test("server error path update", done => {
      expectUpdate(defaults.update.failure)
        .catch(() => done())
    })
  })
});

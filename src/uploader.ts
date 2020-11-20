import { ErrorCallback, PrecommitCallback } from "./config.interface";
import { SimpleLogger } from "./SimpleLogger";
import { DataProvider } from "ra-core";

let logger = new SimpleLogger("uploader", false);

export async function create(
  logging: boolean,
  dataProvider: DataProvider,
  resource: string,
  values: any[],
  preCommitCallback: PrecommitCallback,
  postCommitCallback: ErrorCallback
) {
  const parsedValues = preCommitCallback
    ? await preCommitCallback("create", values)
    : values;
  const reportItems = await createInDataProvider(
    logging,
    dataProvider,
    resource,
    parsedValues
  );
  if (postCommitCallback) {
    postCommitCallback(reportItems);
  }
  const shouldReject =
    !postCommitCallback && reportItems.some((r) => !r.success);
  if (shouldReject) {
    return Promise.reject(reportItems.map((r) => r.response));
  }
}

export async function update(
  logging: boolean,
  dataProvider: DataProvider,
  resource: string,
  values: any[],
  preCommitCallback: PrecommitCallback,
  postCommitCallback: ErrorCallback
) {
  const parsedValues = preCommitCallback
    ? await preCommitCallback("create", values)
    : values;
  const reportItems = await updateInDataProvider(
    logging,
    dataProvider,
    resource,
    parsedValues
  );
  if (postCommitCallback) {
    postCommitCallback(reportItems);
  }
  const shouldReject =
    !postCommitCallback && reportItems.some((r) => !r.success);
  if (shouldReject) {
    return Promise.reject(reportItems.map((r) => r.response));
  }
}

interface ReportItem {
  value: any;
  success: boolean;
  err?: any;
  response?: any;
}

async function createInDataProvider(
  logging: boolean,
  dataProvider: DataProvider,
  resource: string,
  values: any[]
): Promise<ReportItem[]> {
  logger.setEnabled(logging);
  logger.log("addInDataProvider", { dataProvider, resource, values });
  const reportItems: ReportItem[] = [];
  try {
    const response = await dataProvider.createMany(resource, { data: values });
    reportItems.push({
      value: null, success: true, response: response
    })
  } catch (error) {
    const shouldTryFallback = error.toString().includes("Unknown dataProvider");
    const apiError = !shouldTryFallback;
    if (apiError) {
      reportItems.push({
        value: null, err: error, success: false, response: null
      })
    }
    if (shouldTryFallback) {
      logger.log(
        "addInDataProvider",
        "createMany not found on data provider (you may need to implement it): using fallback instead"
      );
      try {
        const items = await createInDataProviderFallback(dataProvider, resource, values);
        reportItems.push(...items);
      } catch (error) {
        logger.error("addInDataProvider", error);
      }
    }
  }
  return reportItems;
}

async function createInDataProviderFallback(
  dataProvider: DataProvider,
  resource: string,
  values: any[]
): Promise<ReportItem[]> {
  const reportItems: ReportItem[] = [];
  await Promise.all(
    values.map((value) =>
      dataProvider
        .create(resource, { data: value })
        .then((res) =>
          reportItems.push({ value: value, success: true, response: res })
        )
        .catch((err) => reportItems.push({ value, success: false, err: err }))
    )
  );
  return reportItems;
}

async function updateInDataProvider(
  logging: boolean,
  dataProvider: DataProvider,
  resource: string,
  values: any[]
) {
  const ids = values.map((v) => v.id);
  logger.setEnabled(logging);
  logger.log("updateInDataProvider", {
    dataProvider,
    resource,
    values,
    logging,
    ids,
  });
  const reportItems: ReportItem[] = [];
  await dataProvider
    .updateMany(resource, { ids: ids, data: values })
    .then((res) =>
      reportItems.push({ value: values, success: true, response: res })
    )
    .catch((err) => reportItems.push({ value: values, success: false, err }));
  return reportItems;
}

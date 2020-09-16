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
    ? preCommitCallback("create", values)
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
    ? preCommitCallback("create", values)
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
    await dataProvider.createMany(resource, { data: values });
  } catch (error) {
    const shouldUseFallback = error.toString().includes("Unknown dataProvider");
    if (shouldUseFallback) {
      logger.log(
        "addInDataProvider",
        "createMany not found on provider: using fallback"
      );
      try {
        await createInDataProviderFallback(dataProvider, resource, values);
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
) {
  const reportItems: ReportItem[] = [];
  await Promise.all(
    values.map((value) =>
      dataProvider
        .create(resource, { data: value })
        .then((res) =>
          reportItems.push({ value, success: true, response: res })
        )
        .catch((err) => reportItems.push({ value, success: false, err }))
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

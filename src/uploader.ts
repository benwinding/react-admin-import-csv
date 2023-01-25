import { ErrorCallback, PrecommitCallback } from "./config.interface";
import { SimpleLogger } from "./SimpleLogger";
import { DataProvider } from "ra-core";

let logger = new SimpleLogger("uploader", false);

export async function create(
  logging: boolean,
  disableCreateMany: boolean | undefined,
  dataProvider: DataProvider,
  resource: string,
  values: any[],
  preCommitCallback?: PrecommitCallback,
  postCommitCallback?: ErrorCallback
) {
  const parsedValues = preCommitCallback
    ? await preCommitCallback("create", values)
    : values;
  const reportItems = await createInDataProvider(
    logging,
    !!disableCreateMany,
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
  disableUpdateMany: boolean | undefined,
  dataProvider: DataProvider,
  resource: string,
  values: any[],
  preCommitCallback?: PrecommitCallback,
  postCommitCallback?: ErrorCallback
) {
  const parsedValues = preCommitCallback
    ? await preCommitCallback("overwrite", values)
    : values;
  const reportItems = await updateInDataProvider(
    logging,
    !!disableUpdateMany,
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

export async function createInDataProvider(
  logging: boolean,
  disableCreateMany: boolean,
  dataProvider: DataProvider,
  resource: string,
  values: any[]
): Promise<ReportItem[]> {
  logger.setEnabled(logging);
  logger.log("createInDataProvider", { dataProvider, resource, values });
  const reportItems: ReportItem[] = [];
  if (disableCreateMany) {
    const items = await createInDataProviderFallback(dataProvider, resource, values);
    reportItems.push(...items);
    return items;
  }
  try {
    const response = await dataProvider.createMany(resource, { data: values });
    reportItems.push({
      value: null, success: true, response: response
    })
  } catch (error) {
    const providerMethodNotFoundErrors = [
      "Unknown dataProvider",
      "createMany",
    ];
    const shouldTryFallback = doesErrorContainString(error, providerMethodNotFoundErrors);
    const apiError = !shouldTryFallback;
    if (apiError) {
      reportItems.push({
        value: null, err: error, success: false, response: null
      })
    }
    if (shouldTryFallback) {
      logger.log(
        "createInDataProvider",
        "createMany not found on data provider (you may need to implement it see: https://github.com/benwinding/react-admin-import-csv#reducing-requests): using fallback instead"
      );
      try {
        const items = await createInDataProviderFallback(dataProvider, resource, values);
        reportItems.push(...items);
      } catch (error) {
        logger.error("createInDataProvider", error);
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
  disableUpdateMany: boolean,
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
  if (disableUpdateMany) {
    const items = await updateInDataProviderFallback(dataProvider, resource, values);
    return items;
  }
  const reportItems: ReportItem[] = [];
  try {
    const response = await dataProvider.updateManyArray(resource, { ids: ids, data: values });
    reportItems.push({
      value: null, success: true, response: response
    })
  } catch (error) {
    const providerMethodNotFoundErrors = [
      "Unknown dataProvider",
      "updateMany",
    ];
    const shouldTryFallback = doesErrorContainString(error, providerMethodNotFoundErrors);
    const apiError = !shouldTryFallback;
    if (apiError) {
      reportItems.push({
        value: null, err: error, success: false, response: null
      })
    }
    if (shouldTryFallback) {
      logger.log(
        "updateInDataProvider",
        "updateManyArray not found on data provider (you may need to implement it see: https://github.com/benwinding/react-admin-import-csv#reducing-requests): using fallback instead"
      );
      try {
        const items = await updateInDataProviderFallback(dataProvider, resource, values);
        reportItems.push(...items);
      } catch (error) {
        logger.error("updateInDataProvider", error);
      }
    }
  }
  return reportItems;
}

async function updateInDataProviderFallback(
  dataProvider: DataProvider,
  resource: string,
  values: any[]
): Promise<ReportItem[]> {
  const reportItems: ReportItem[] = [];
  await Promise.all(
    values.map((value) =>
      dataProvider
        .update(resource, { id: value.id, data: value, previousData: null as any })
        .then((res) =>
          reportItems.push({ value: value, success: true, response: res })
        )
        .catch((err) => reportItems.push({ value: value, success: false, err }))
    )
  );
  return reportItems;
}

function doesErrorContainString(error: any, stringsToCheck: string[]): boolean {
  const errorString = (!!error && typeof error === 'object' && error?.toString()) || '';
  const shouldTryFallback = stringsToCheck.some(stringToCheck => errorString.includes(stringToCheck));
  return shouldTryFallback;
}

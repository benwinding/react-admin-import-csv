import { DataProvider } from "ra-core";

export async function create(
  dataProvider: DataProvider,
  resource: string,
  values: any[],
  postCommitCallback = null,
  useCreateMany = false,
  logging = false
) {
  const reportItems = await createInDataProvider(
    dataProvider,
    resource,
    values,
    useCreateMany,
    logging
  );
  if (postCommitCallback) {
    postCommitCallback(reportItems);
  }
  const shouldReject = !postCommitCallback && reportItems.some(r => !r.success);
  if (shouldReject) {
    return Promise.reject(reportItems.map(r => r.response));
  }
}

export async function update(
  dataProvider: DataProvider,
  resource: string,
  values: any[],
  postCommitCallback = null,
  useCreateMany = false,
  logging = false
) {
  const reportItems = await updateInDataProvider(
    dataProvider,
    resource,
    values,
    useCreateMany,
    logging
  );
  if (postCommitCallback) {
    postCommitCallback(reportItems);
  }
  const shouldReject = !postCommitCallback && reportItems.some(r => !r.success);
  if (shouldReject) {
    return Promise.reject(reportItems.map(r => r.response));
  }
}

interface ReportItem {
  value: any;
  success: boolean;
  err?: any;
  response?: any;
}

async function createInDataProvider(
  dataProvider: DataProvider,
  resource: string,
  values: any[],
  useCreateMany: boolean,
  logging: boolean
): Promise<ReportItem[]> {
  if (logging) {
    console.log("uploader.addInDataProvider", {
      dataProvider,
      resource,
      values,
      logging,
      useCreateMany,
    });
  }
  const reportItems: ReportItem[] = [];
  if (useCreateMany) {
    await dataProvider
      .createMany(resource, { data: values })
      .then(() => reportItems.push({ value: values, success: true }))
      .catch((err) => reportItems.push({ value: values, success: false, err }));
  } else {
    await Promise.all(
      values.map((value) =>
        dataProvider
          .create(resource, { data: value })
          .then((res) => reportItems.push({ value, success: true, response: res }))
          .catch((err) => reportItems.push({ value, success: false, err }))
      )
    );
  }
  return reportItems;
}

async function updateInDataProvider(
  dataProvider: DataProvider,
  resource: string,
  values: any[],
  useCreateMany: boolean,
  logging: boolean
) {
  const ids = values.map((v) => v.id);
  if (logging) {
    console.log("uploader.updateInDataProvider", {
      dataProvider,
      resource,
      values,
      logging,
      useCreateMany,
      ids,
    });
  }
  const reportItems: ReportItem[] = [];
  if (useCreateMany) {
    await dataProvider
      .updateMany(resource, { ids: ids, data: values })
      .then((res) => reportItems.push({ value: values, success: true, response: res }))
      .catch((err) => reportItems.push({ value: values, success: false, err }));
  } else {
    await Promise.all(
      values.map((value) =>
        dataProvider
          .update(resource, { id: value.id, data: value } as any)
          .then((res) => reportItems.push({ value, success: true, response: res }))
          .catch((err) => reportItems.push({ value, success: false, err }))
      )
    );
  }
  return reportItems;
}

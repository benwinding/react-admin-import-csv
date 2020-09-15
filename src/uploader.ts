import { DataProvider } from "ra-core";

export async function create(
  dataProvider: DataProvider,
  resource: string,
  values: any[],
  postCommitCallback = null,
  useCreateMany = false,
  logging = false
) {
  if (postCommitCallback) {
    const report = [];
    await createInDataProvider(
      dataProvider,
      resource,
      values,
      useCreateMany,
      logging
    )
      .then(() => report.push({ values, success: true }))
      .catch((err) => report.push({ values, success: false, err }));
    return postCommitCallback(report);
  }
  return createInDataProvider(
    dataProvider,
    resource,
    values,
    useCreateMany,
    logging
  );
}

export async function update(
  dataProvider: DataProvider,
  resource: string,
  values: any[],
  postCommitCallback = null,
  logging = false
) {
  if (postCommitCallback) {
    const report = [];
    await updateInDataProvider(dataProvider, resource, values, logging)
      .then(() => report.push({ values, success: true }))
      .catch((err) => report.push({ values, success: false, err }));
    return postCommitCallback(report);
  }
  return updateInDataProvider(dataProvider, resource, values, logging);
}

async function createInDataProvider(
  dataProvider: DataProvider,
  resource: string,
  values: any[],
  useCreateMany: boolean,
  logging: boolean
) {
  if (logging) {
    console.log("uploader.addInDataProvider", {
      dataProvider,
      resource,
      values,
      logging,
      useCreateMany,
    });
  }
  if (useCreateMany) {
    return dataProvider.createMany(resource, { data: values });
  }
  return Promise.all(
    values.map((value) => dataProvider.create(resource, { data: value }))
  );
}

async function updateInDataProvider(
  dataProvider: DataProvider,
  resource: string,
  values: any[],
  logging: boolean
) {
  const ids = values.map((v) => v.id);
  if (logging) {
    console.log("uploader.updateInDataProvider", {
      dataProvider,
      resource,
      values,
      logging,
      ids,
    });
  }
  return dataProvider.updateMany(resource, { ids: ids, data: values });
}

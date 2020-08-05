export async function create(dataProvider, resource, values, postCommitCallback = null) {

  if(postCommitCallback) {
    const report = []
    await Promise
      .all(values.map((value) => dataProvider
        .create(resource, { data: value })
        .then(() => report.push({...value, success: true}))
        .catch(err => report.push({...value, success: false, err}))))
        .finally(() => postCommitCallback(report))
    return;
  }
  else {
    return Promise.all(values.map((value) => dataProvider.create(resource, { data: value })));
  }
}

export async function update(dataProvider, resource, values, postCommitCallback = null) {
  if(postCommitCallback) {
    const report = []

    await Promise
      .all(values.map((value) => dataProvider
        .update(resource, { id: value.id, data: value })
        .then(() => report.push({...value, success: true}))
        .catch(err => report.push({...value, success: false, err}))))
        .finally(() => postCommitCallback(report));

    return;
  }
  else {
    return Promise.all(values.map((value) => dataProvider.update(resource, { id: value.id, data: value })))
  };
}


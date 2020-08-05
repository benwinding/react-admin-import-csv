export async function create(dataProvider, resource, values, reportCallback = null) {

  if(reportCallback) {
    const report = []
    await Promise
      .all(values.map((value) => dataProvider
        .create(resource, { data: value })
        .then(() => report.push({...value, success: true}))
        .catch(err => report.push({...value, success: false, err}))))
        .finally(() => reportCallback(report))
    return;
  }
  else {
    return Promise.all(values.map((value) => dataProvider.create(resource, { data: value })));
  }
}

export async function update(dataProvider, resource, values, reportCallback = null) {
  if(reportCallback) {
    const report = []

    await Promise
      .all(values.map((value) => dataProvider
        .update(resource, { id: value.id, data: value })
        .then(() => report.push({...value, success: true}))
        .catch(err => report.push({...value, success: false, err}))))
        .finally(() => reportCallback(report));

    return;
  }
  else {
    return Promise.all(values.map((value) => dataProvider.update(resource, { id: value.id, data: value })))
  };
}


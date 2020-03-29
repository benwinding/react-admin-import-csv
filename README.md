# react-admin-import-csv
<!-- [START badges] -->
![Build and Publish](https://github.com/benwinding/react-admin-import-csv/workflows/Build%20and%20Publish/badge.svg)
[![Code Coverage](https://raw.githubusercontent.com/benwinding/react-admin-import-csv/master/coverage/badge-lines.svg?sanitize=true)](./coverage/coverage-summary.json)
[![NPM Version](https://img.shields.io/npm/v/react-admin-import-csv.svg)](https://www.npmjs.com/package/react-admin-import-csv) 
[![License](https://img.shields.io/npm/l/react-admin-import-csv.svg)](https://github.com/benwinding/react-admin-import-csv/blob/master/LICENSE) 
[![Downloads/week](https://img.shields.io/npm/dm/react-admin-import-csv.svg)](https://www.npmjs.com/package/react-admin-import-csv) 
[![Github Issues](https://img.shields.io/github/issues/benwinding/react-admin-import-csv.svg)](https://github.com/benwinding/react-admin-import-csv)
<!-- [END badges] -->

CSV import button for react-admin.

![image](https://user-images.githubusercontent.com/11782590/77844922-0d74bc80-71f2-11ea-8c41-b0c0f7358b9b.png)

## Usage

Simply import the button into a toolbar, like so:

### Basic Import Action Only

``` js
import {
  Datagrid,
  List,
  TextField,
  RichTextField,
  TopToolbar
} from "react-admin";
import { ImportButton } from "react-admin-import-csv";
import { CreateButton } from "ra-ui-materialui";

const ListActions = props => {
  const { className, basePath } = props;
  return (
    <TopToolbar className={className}>
      <CreateButton basePath={basePath} />
      <ImportButton {...props} />
    </TopToolbar>
  );
};
export const PostList = props => (
  <List {...props} filters={<PostFilter />} actions={<ListActions />}>
    <Datagrid>
      <TextField source="title" />
      <RichTextField source="body" />
      ...
    </Datagrid>
  </List>
);
```

### Export/Import Actions

``` js
import {
  Datagrid,
  List,
  TextField,
  RichTextField,
  TopToolbar
} from "react-admin";
import { ImportButton } from "react-admin-import-csv";
import { CreateButton, ExportButton } from "ra-ui-materialui";

const ListActions = props => {
  const { 
    className, 
    basePath, 
    total, 
    resource, 
    currentSort, 
    filterValues, 
    exporter 
  } = props;
  return (
    <TopToolbar className={className}>
      <CreateButton basePath={basePath} />
      <ExportButton
        disabled={total === 0}
        resource={resource}
        sort={currentSort}
        filter={filterValues}
        exporter={exporter}
      />
      <ImportButton {...props} />
    </TopToolbar>
  );
};
export const PostList = props => (
  <List {...props} filters={<PostFilter />} actions={<ListActions />}>
    <Datagrid>
      <TextField source="title" />
      <RichTextField source="body" />
      ...
    </Datagrid>
  </List>
);
```

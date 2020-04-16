# react-admin-import-csv
<!-- [START badges] -->
[![NPM Version](https://img.shields.io/npm/v/react-admin-import-csv.svg)](https://www.npmjs.com/package/react-admin-import-csv) 
[![Downloads/week](https://img.shields.io/npm/dm/react-admin-import-csv.svg)](https://www.npmjs.com/package/react-admin-import-csv) 
[![License](https://img.shields.io/npm/l/react-admin-import-csv.svg)](https://github.com/benwinding/react-admin-import-csv/blob/master/LICENSE) 
[![Github Issues](https://img.shields.io/github/issues/benwinding/react-admin-import-csv.svg)](https://github.com/benwinding/react-admin-import-csv)
![Build and Publish](https://github.com/benwinding/react-admin-import-csv/workflows/Build%20and%20Publish/badge.svg)
[![Code Coverage](https://raw.githubusercontent.com/benwinding/react-admin-import-csv/master/coverage/badge-lines.svg?sanitize=true)](./coverage/coverage-summary.json)
<!-- [END badges] -->

CSV import button for react-admin.

![image](https://i.imgur.com/HeBEe3C.gif)

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

## Configuration Options

``` typescript
// All configurations are optional
const config = {
  logging?: boolean,
  parseConfig?: {
    // Any option from papaparse
    // Any option from 
  } 
}
<ImportButton {...props} {...config}/>
```

# Development

If you'd like to develop on `react-admin-import-csv` do the following.

## Local install
- `git clone https://github.com/benwinding/react-admin-import-csv/`
- `cd react-admin-import-csv`
- `yarn`

## Tests
- `yarn test  # in root folder`

## Run demo
Open another terminal

- `yarn build-watch`

Open another terminal and goto the `demo` folder
- `yarn start`

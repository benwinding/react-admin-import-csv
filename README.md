# react-admin-import-csv

<!-- [START badges] -->

[![NPM Version](https://img.shields.io/npm/v/react-admin-import-csv.svg)](https://www.npmjs.com/package/react-admin-import-csv)
[![Downloads/week](https://img.shields.io/npm/dm/react-admin-import-csv.svg)](https://www.npmjs.com/package/react-admin-import-csv)
[![License](https://img.shields.io/npm/l/react-admin-import-csv.svg)](https://github.com/benwinding/react-admin-import-csv/blob/master/LICENSE)
[![Github Issues](https://img.shields.io/github/issues/benwinding/react-admin-import-csv.svg)](https://github.com/benwinding/react-admin-import-csv)
![Build and Publish](https://github.com/benwinding/react-admin-import-csv/workflows/Build%20and%20Publish/badge.svg)
[![Code Coverage](https://raw.githubusercontent.com/benwinding/react-admin-import-csv/master/coverage/badge-lines.svg?sanitize=true)](./coverage/coverage-summary.json)

<!-- [END badges] -->

CSV import button for the [react-admin](https://github.com/marmelab/react-admin) framework.

![image](https://user-images.githubusercontent.com/11782590/93659721-83622e00-fa87-11ea-90c4-650aecf60a6a.gif)

## Usage

Simply import the button into a toolbar, like so:

### Basic Import Action Only

```js
import {
  Datagrid,
  List,
  TextField,
  RichTextField,
  TopToolbar,
} from "react-admin";
import { ImportButton } from "react-admin-import-csv";
import { CreateButton } from "ra-ui-materialui";

const ListActions = (props) => {
  const { className, basePath } = props;
  return (
    <TopToolbar className={className}>
      <CreateButton basePath={basePath} />
      <ImportButton {...props} />
    </TopToolbar>
  );
};
export const PostList = (props) => (
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

```js
import {
  Datagrid,
  List,
  TextField,
  RichTextField,
  TopToolbar,
} from "react-admin";
import { ImportButton } from "react-admin-import-csv";
import { CreateButton, ExportButton } from "ra-ui-materialui";

const ListActions = (props) => {
  const {
    className,
    basePath,
    total,
    resource,
    currentSort,
    filterValues,
    exporter,
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
export const PostList = (props) => (
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

```typescript
// All configuration options are optional
const config: ImportConfig = {
  // Enable logging
  logging?: boolean;
  // Disable the attempt to use "createMany", will instead just use "create" calls
  disableCreateMany?: boolean,
  // Disable the attempt to use "updateMany", will instead just use "update" calls
  disableUpdateMany?: boolean,
  // Disable "import new" button
  disableImportNew?: boolean;
  // Disable "import overwrite" button
  disableImportOverwrite?: boolean;
  // A function to translate the CSV rows on import
  preCommitCallback?: (action: "create" | "overwrite", values: any[]) => Promise<any[]>;
  // A function to handle row errors after import
  postCommitCallback?: (error: any) => void;
  // Transform rows before anything is sent to dataprovider
  transformRows?: (csvRows: any[]) => Promise<any[]>;
  // Async function to Validate a row, reject the promise if it's not valid
  validateRow?: (csvRowItem: any) => Promise<void>;
  // Any option from the "papaparse" library
  parseConfig?: {
    // For all options see: https://www.papaparse.com/docs#config
  }
}
<ImportButton {...props} {...config}/>
```

## Handle `id` fields which might be numbers

Use the `paparse` configuration option [`dynamicTyping`](https://www.papaparse.com/docs)

```js
const importOptions = {
  parseConfig?: {
    // For all options see: https://www.papaparse.com/docs#config
    dynamicTyping: true
  }
}
```

## Reducing Requests (`.createMany()` and `.updateMany()`)

Your dataprovider will need to implement the `.createMany()` method in order to reduce requests to your backend. If it doesn't exist, it will fallback to calling `.create()` on all items, as shown below (same goes for `.update()`):

| Name              | Special Method     | Fallback Method |
| ----------------- | ------------------ | --------------- |
| Creating from CSV | .createMany()      | .create()       |
| Updating from CSV | .updateManyArray() | .update()       |

*Note: You can disable this feature setting `disableCreateMany: true` or `disableUpdateMany: true` in the configuration.*
### Interfaces

The dataprovider should accept these param interfaces for the bulk create/update methods.

```typescript
export interface UpdateManyArrayParams {
  ids: Identifier[];
  data: any[];
}
export interface CreateManyParams {
  data: any[];
}
```

### Example Implementation

Here's a quick example of how to implement `.createMany()` and `.updateMany()` in your dataprovider:

``` js
// Must be react-admin 3.x
const dataProviderWrapped = {
  ...dataProvider, // <- Your data provider
  createMany: async (resource, params) => {
    const items = params.data;
    // Handle create many here
  },
  updateMany: async (resource, params) => {
    const items = params.data;
    const idsToUpdate = params.ids;
    // Handle update many here
  }
}

// Pass into to other parts of the system as normal
return (
  <Admin dataProvider={dataProviderWrapped}
```

## Translation `i18n`

This package uses `react-admin`'s global i18n translation. Below is an example on how to set it up with this package.

Current supported languages (submit a PR if you'd like to add a language):

- English (en)
- Spanish (es)
- Chinese (zh)
- German (de)
- French (fr)
- Brazilian Portuguese (ptBR)
- Russian (ru)
- Dutch (nl)

**Example (i18nProvider)**

```jsx
import { resolveBrowserLocale, useLocale } from "react-admin";
import polyglotI18nProvider from "ra-i18n-polyglot";
import englishMessages from "ra-language-english";
// This package's translations
import * as domainMessages from "react-admin-import-csv/lib/i18n";

// Select locale based on react-admin OR browser
const locale = useLocale() || resolveBrowserLocale();
// Create messages object
const messages = {
  // Delete languages you don't need
  en: { ...englishMessages, ...domainMessages.en },
  zh: { ...chineseMessages, ...domainMessages.zh },
  es: { ...spanishMessages, ...domainMessages.es },
};
// Create polyglot provider
const i18nProvider = polyglotI18nProvider(
  (locale) => (messages[locale] ? messages[locale] : messages.en),
  locale
);

// declare prop in Admin component
<Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
```

[More information on this setup here](https://marmelab.com/react-admin/Translation.html)

# Development

If you'd like to develop on `react-admin-import-csv` do the following.

## Local install

- `git clone https://github.com/benwinding/react-admin-import-csv/`
- `cd react-admin-import-csv`
- `yarn`

## Tests

- `yarn test # in root folder`

## Run demo

Open another terminal

- `yarn build-watch`

Open another terminal and goto the `demo` folder

- `yarn start`

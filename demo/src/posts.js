// in src/posts.js
import * as React from "react";
// tslint:disable-next-line:no-var-requires
import {
  Datagrid,
  List,
  Show,
  Create,
  Edit,
  SimpleShowLayout,
  SimpleForm,
  TextField,
  TextInput,
  TopToolbar,
  ShowButton,
  EditButton,
  DeleteButton,
  downloadCSV,
} from "react-admin";
import jsonExport from "jsonexport/dist";
// Change this import to: from "react-admin-import-csv"
import { ImportButton } from "./build-watch";
import { CreateButton, ExportButton } from "ra-ui-materialui";

const defaultExporter = (posts) => {
  jsonExport(
    posts,
    {
      headers: ["id", "title"],
    },
    (err, csv) => {
      downloadCSV(csv, "posts");
    }
  );
};

const ListActions = (props) => {
  const { className, basePath } = props;

  const config = {
    logging: true,
    postCommitCallback: (report) => console.log("Report", report),
    disableImportNew: false,
    disableImportOverwrite: false,
  };

  return (
    <TopToolbar className={className}>
      <CreateButton basePath={basePath} />
      <ImportButton {...props} {...config} />
      <ExportButton exporter={defaultExporter} />
    </TopToolbar>
  );
};

export const PostList = (props) => (
  <List {...props} actions={<ListActions />}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <ShowButton label="" />
      <EditButton label="" />
      <DeleteButton label="" redirect={false} />
    </Datagrid>
  </List>
);

export const PostShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
    </SimpleShowLayout>
  </Show>
);

export const PostCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="title" />
    </SimpleForm>
  </Create>
);

export const PostEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="title" />
    </SimpleForm>
  </Edit>
);

import React from "react";
import { Button } from "react-admin";
import GetAppIcon from "@material-ui/icons/GetApp";
import { useNotify, useDataProvider } from "react-admin";
import { processCsvFile } from "./csv-extractor";

export const ImportButton = (props: any) => {
  const { resource, parseConfig, logging } = props;
  if (logging) {
    console.log({ props });
  }
  if (!resource) {
    throw new Error(
      "the 'resource' prop was empty, did you pass in the {...props} to the ImportButton?"
    );
  }

  const notify = useNotify();
  const dataProvider = useDataProvider();

  const onFileAdded = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    const values = await processCsvFile(file, parseConfig);
    if (logging) {
      console.log({ values });
    }
    await Promise.all(
      values.map((value) => dataProvider.create(resource, { data: value }))
    );
    notify("CSV Imported!");
  };

  return (
    <>
      <input
        type="file"
        id="text-button-file"
        style={{ display: "none" }}
        accept=".csv"
        onChange={onFileAdded}
      />
      <label
        htmlFor="text-button-file"
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        <Button color="primary" component="span" label="Import">
          <GetAppIcon style={{ transform: "rotate(180deg)", fontSize: "20" }} />
        </Button>
      </label>
    </>
  );
};

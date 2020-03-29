import React from "react";
import Button from "@material-ui/core/Button";
import GetAppIcon from "@material-ui/icons/GetApp";
import { useNotify, useDataProvider } from "react-admin";
import { processCsvFile } from "./csv-extractor";

export const ImportButton = (props: any) => {
  const { resource } = props;

  const notify = useNotify();
  const dataProvider = useDataProvider();

  const onFileAdded = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    const values = await processCsvFile(file);
    console.log({ values });
    await Promise.all(
      values.map(value => dataProvider.create(resource, { data: value }))
    );
    notify("CSV Imported!");
  };

  return (
    <div>
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
        <Button color="primary" component="span">
          <GetAppIcon style={{ transform: "rotate(180deg)", fontSize: "20" }} />
          <span
            style={{
              paddingLeft: "0.5em",
              margin: "-10px 0",
              fontSize: "0.9em"
            }}
          >
            Import
          </span>
        </Button>
      </label>
    </div>
  );
};

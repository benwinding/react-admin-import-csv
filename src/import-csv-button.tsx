import React from "react";
import { Button as RAButton } from "react-admin";
import GetAppIcon from "@material-ui/icons/GetApp";
import { useNotify, useDataProvider } from "react-admin";
import { processCsvFile } from "./csv-extractor";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

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

  const [open, setOpen] = React.useState(false);
  const [fileName, setFileName] = React.useState(null as string);
  const [values, setValues] = React.useState(null as any[]);
  const [errorTxt, setErrorTxt] = React.useState(null as string);

  const openImportDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmitCreate = async () => {
    setOpen(false);
    try {
      await Promise.all(
        values.map((value) => dataProvider.create(resource, { data: value }))
      );
      notify(`Imported ${fileName}`);
    } catch (error) {
      notify(`Error importing ${fileName}, ${error}`);
    }
  };

  const handleSubmitOverwrite = async () => {
    setOpen(false);
    try {
      await Promise.all(
        values.map((value) =>
          dataProvider.update(resource, { id: value.id, data: value })
        )
      );
      notify(`Imported ${fileName}`);
    } catch (error) {
      notify(`Error importing ${fileName}, ${error}`);
    }
  };

  const notify = useNotify();
  const dataProvider = useDataProvider();

  const onFileAdded = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setFileName(file.name);
    try {
      const values = await processCsvFile(file, parseConfig);
      if (values.some((v) => !v.id)) {
        throw new Error('Some rows have no value for the "id" column');
      }
      if (logging) {
        console.log({ values });
      }
      setValues(values);
      setErrorTxt(null);
    } catch (error) {
      console.error(error);
      setValues(null);
      setErrorTxt(error.toString());
    }
  };

  return (
    <>
      <RAButton
        color="primary"
        component="span"
        label="Import"
        onClick={openImportDialog}
      >
        <GetAppIcon style={{ transform: "rotate(180deg)", fontSize: "20" }} />
      </RAButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Import to "{resource}"
        </DialogTitle>
        <DialogContent>
          <div
            id="alert-dialog-description"
            style={{ fontFamily: "sans-serif" }}
          >
            <p style={{ margin: "0px" }}>Data file requirements</p>
            <ol>
              <li>Must be a '.csv' or '.tsv' file</li>
              <li>Must contain an 'id' column</li>
            </ol>

            <Button variant="contained" component="label">
              <span>Choose File</span>
              <GetAppIcon
                style={{ transform: "rotate(180deg)", fontSize: "20" }}
              />
              <input
                type="file"
                style={{ display: "none" }}
                onChange={onFileAdded}
                accept=".csv,.tsv,.txt"
              />
            </Button>

            {!!fileName && (
              <p style={{ marginBottom: "0px" }}>
                Processed: <strong>{fileName}</strong>
              </p>
            )}
            {!!values && (
              <p style={{ margin: "0px" }}>
                Row Count: <strong>{values.length}</strong>
              </p>
            )}
            {!!errorTxt && (
              <p style={{ margin: "0px", color: "red" }}>{errorTxt}</p>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <span>Cancel</span>
          </Button>
          <Button
            disabled={!values}
            onClick={handleSubmitCreate}
            color="secondary"
            variant="contained"
          >
            <span>Import as New</span>
          </Button>
          <Button
            disabled={!values}
            onClick={handleSubmitOverwrite}
            color="primary"
            variant="contained"
          >
            <span>Import as Overwrite</span>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

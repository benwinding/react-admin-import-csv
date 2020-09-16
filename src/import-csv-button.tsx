import React from "react";
import GetAppIcon from "@material-ui/icons/GetApp";
import {
  Button as RAButton,
  useRefresh,
  useNotify,
  useDataProvider,
  useTranslate,
} from "react-admin";

import {
  Button,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@material-ui/core";
import { ImportConfig } from "./config.interface";
import { SimpleLogger } from "./SimpleLogger";
import {
  CheckCSVValidation,
  GetCSVItems,
  GetIdsColliding,
} from "./import-controller";
import { create } from "./uploader";

export const ImportButton = (props: any) => {
  const refresh = useRefresh();
  const translate = useTranslate();
  const dataProvider = useDataProvider();

  const {
    logging,
    parseConfig,
    disableImportNew,
    disableImportOverwrite,
    preCommitCallback,
    postCommitCallback,
    validateRow,
  } = props as ImportConfig;
  let { variant, label, resource, resourceName } = props;
  const logger = new SimpleLogger("import-csv-button", true);
  logger.setEnabled(logging);

  warnAboutRemovedFunctions(props);

  if (!resource) {
    throw new Error(translate("csv.error.emptyResource"));
  }

  if (!label) {
    label = translate("csv.main.import");
  }

  if (!variant) {
    variant = "text";
  }

  if (!resourceName) {
    resourceName = resource;
  }

  const [open, setOpen] = React.useState(false);
  const [openAsk, setOpenAsk] = React.useState(false);
  const [importStatus, setImportStatus] = React.useState(null as string);
  const [values, setValues] = React.useState(null as any[]);
  const [countTotalRows, setCountTotalRows] = React.useState(null as number);
  const [countOverwrite, setCountOverwrite] = React.useState(null as number);

  const [fileName, setFileName] = React.useState(null as string);
  const [errorTxt, setErrorTxt] = React.useState(null as string);
  let refInput: HTMLInputElement;

  function logStatus(str: string) {
    logger.log(str);
    setImportStatus(str);
  }

  const clickImportButton = async () => {
    refInput.value = "";
    refInput.click();
  };

  const onFileAdded = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setFileName(file.name);
    setOpen(true);
    try {
      // Is valid csv
      logStatus("Parsing CSV file");
      const csvItems = await GetCSVItems(logging, translate, file, parseConfig);
      // Does CSV pass user validation
      logStatus("Validating CSV file");
      await CheckCSVValidation(logging, translate, csvItems, validateRow);
      setValues(csvItems);
      // Are there any import overwrites?
      logStatus("Checking rows to import");
      const collidingIds = await GetIdsColliding(
        logging,
        translate,
        dataProvider,
        csvItems,
        resourceName
      );
      const hasCollidingIds = !!collidingIds.length;
      setCountOverwrite(collidingIds.length);
      if (hasCollidingIds) {
        // Ask Replace X Rows? Skip these rows? Decied For Each?
        logStatus("Ask Replace X Rows?" + hasCollidingIds);
        setOpenAsk(true);
      } else {
        await create(
          logging,
          dataProvider,
          resourceName,
          csvItems,
          preCommitCallback,
          postCommitCallback
        );
        handleClose()
      }
      // Begin Import
    } catch (error) {
      logStatus("");
      setErrorTxt(error.toString());
    }
  };

  const notify = useNotify();
  const handleClose = () => {
    setOpen(false);
    notify("csv.alert.imported");
    setValues(null);
    setFileName(null);
    refresh();
  };

  const handleAskClose = () => {
    setOpen(false);
    setFileName(null as string);
  };

  const handleReplace = () => {};

  const handleSkip = () => {};

  const handleAskDecide = () => {};

  return (
    <>
      <Tooltip title={translate("csv.dialog.extension")}>
        <div>
          <RAButton
            color="primary"
            component="span"
            variant={variant}
            label={label}
            onClick={clickImportButton}
          >
            <GetAppIcon
              style={{ transform: "rotate(180deg)", fontSize: "20" }}
            />
          </RAButton>
          <input
            ref={(ref) => (refInput = ref)}
            type="file"
            style={{ display: "none" }}
            onChange={onFileAdded}
            accept=".csv,.tsv"
          />
        </div>
      </Tooltip>

      <Dialog
        open={openAsk}
        onClose={handleAskClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Replace or Skip Records
        </DialogTitle>
        <DialogContent>
          <div>
            <Button onClick={handleReplace}>
              <span>Replace the rows</span>
            </Button>
            <Button onClick={handleSkip}>
              <span>Skip these rows</span>
            </Button>
            <Button onClick={handleAskDecide}>
              <span>Let me decide for each row</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {translate("csv.dialog.importTo", {
            resource: resourceName,
            count: countTotalRows,
          })}
        </DialogTitle>
        <DialogContent>
          <div
            id="alert-dialog-description"
            style={{ fontFamily: "sans-serif" }}
          >
            <p style={{ margin: "0px" }}>
              file: <strong>{fileName}</strong>
              rows: <strong>{countTotalRows}</strong>
            </p>

            <p style={{ margin: "0px" }}>Status</p>
            {!!importStatus && <p>{importStatus}</p>}

            {!!errorTxt && (
              <div>
                <p>Error:</p>
                <p style={{ margin: "0px", color: "red" }}>{errorTxt}</p>
              </div>
            )}
            <pre>
            {JSON.stringify(values, null, 2) }
            </pre>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <span>{translate("csv.dialog.cancel")}</span>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

function warnAboutRemovedFunctions(props) {
  const logger = new SimpleLogger("import-csv-button warning", true);
  const oldRemovedProps = [
    "disableImportNew",
    "disableImportOverwrite",
    "postCommitCallback",
    "preCommitCallback",
  ];
  oldRemovedProps.map((oldRemovedProp) => {
    if (props[oldRemovedProp]) {
      logger.warn(
        `The setting: "${oldRemovedProp}" has been removed from the "react-admin-import-csv" package, goto https://github.com/benwinding/react-admin-import-csv for the updated API`
      );
    }
  });
}

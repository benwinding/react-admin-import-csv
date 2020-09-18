import React from "react";
import {
  Button as RAButton,
  useRefresh,
  useNotify,
  useDataProvider,
  useTranslate,
} from "react-admin";

import {
  Button,
  List,
  ListItem,
  Tooltip,
  Dialog,
  CircularProgress,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { Done, FileCopy, Undo, Clear } from "@material-ui/icons";
import GetAppIcon from "@material-ui/icons/GetApp";

import { ImportConfig } from "./config.interface";
import { SimpleLogger } from "./SimpleLogger";
import {
  CheckCSVValidation,
  GetCSVItems,
  GetIdsColliding,
} from "./import-controller";
import { create } from "./uploader";

export const BtnOption = (props: any) => {
  return (
    <ListItem disableGutters={true}>
      <Button
        style={{ width: "100%", backgroundColor: "#efefef", padding: "13px" }}
        onClick={props.onClick}
      >
        {props.icon}
        <span style={{ width: "100%", textAlign: "left", marginLeft: "8px" }}>
          {props.label}
        </span>
      </Button>
    </ListItem>
  );
};

export const ImportButton = (props: any) => {
  const refresh = useRefresh();
  const translate = useTranslate();
  const dataProvider = useDataProvider();

  const {
    logging,
    parseConfig,
    preCommitCallback,
    postCommitCallback,
    validateRow,
  } = props as ImportConfig;
  let { variant, label, resource, resourceName } = props;
  const logger = new SimpleLogger("import-csv-button", true);
  logger.setEnabled(logging);

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
  const [openAskDecide, setOpenAskDecide] = React.useState(false);
  const [values, setValues] = React.useState(null as any[]);
  const [idsConflicting, setIdsConflicting] = React.useState(null as any[]);
  const [isLoading, setIsLoading] = React.useState(null as boolean);
  const [currentValue, setCurrentValue] = React.useState(null as any);

  const [fileName, setFileName] = React.useState(null as string);
  let refInput: HTMLInputElement;

  function resetVars() {
    setOpen(false);
    setOpenAskDecide(false);
    setValues(null);
    setIdsConflicting(null);
    setIsLoading(null);
    setFileName(null);
  }

  async function createRows(vals: any[]) {
    return create(
      logging,
      dataProvider,
      resourceName,
      vals,
      preCommitCallback,
      postCommitCallback
    );
  }

  function clickImportButton() {
    resetVars();
    refInput.value = "";
    refInput.click();
  }

  const onFileAdded = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setFileName(file.name);
    setOpen(true);
    try {
      // Is valid csv
      logger.log("Parsing CSV file");
      const csvItems = await GetCSVItems(logging, translate, file, parseConfig);
      setValues(csvItems);
      // Does CSV pass user validation
      logger.log("Validating CSV file");
      await CheckCSVValidation(logging, translate, csvItems, validateRow);
      // Are there any import overwrites?
      logger.log("Checking rows to import");
      const collidingIds = await GetIdsColliding(
        logging,
        translate,
        dataProvider,
        csvItems,
        resourceName
      );
      setIdsConflicting(collidingIds);
      const hasCollidingIds = !!collidingIds.length;
      logger.log("Is has colliding ids?", { hasCollidingIds, collidingIds });
      if (hasCollidingIds) {
        // Ask Replace X Rows? Skip these rows? Decied For Each?
        const collindingIdsSet = new Set(collidingIds.map((id) => id));
        const csvItemsNotColliding = csvItems.filter(
          (item) => !collindingIdsSet.has(item.id)
        );
        logger.log("Importing items which arent colliding", {
          csvItemsNotColliding,
        });
        await createRows(csvItemsNotColliding);
      } else {
        await createRows(csvItems);
        handleClose();
      }
      // Begin Import
    } catch (error) {
      resetVars();
      logger.error(error);
    }
  };

  const notify = useNotify();
  const handleClose = () => {
    resetVars();
    notify("csv.alert.imported");
    refresh();
  };

  const handleReplace = async () => {
    logger.log("handleReplace");
    try {
      setIsLoading(true);
      await new Promise((res) => setTimeout(res, 1000));
      const collindingIdsSet = new Set(idsConflicting.map((id) => id));
      const valuesColliding = values.filter((item) =>
        collindingIdsSet.has(item.id)
      );
      valuesColliding.map((v) => delete v.id);
      await createRows(valuesColliding);
      handleClose();
    } catch (error) {
      setIsLoading(false);
      logger.error("handleReplace", error);
    }
  };

  const handleSkip = () => {
    logger.log("handleSkip");
    handleClose();
  };

  const nextConflicting = () => {
    const currentId = Array.isArray(idsConflicting) && idsConflicting.pop();
    setIdsConflicting(idsConflicting);
    const foundValue = values.filter((v) => v.id === currentId).pop();
    logger.log("nextConflicting", { foundValue, currentId });
    const isLast = !foundValue;
    if (isLast) {
      return true;
    }
    setCurrentValue(foundValue);
  };

  const handleAskDecide = async () => {
    logger.log("handleAskDecide");
    setOpen(false);
    nextConflicting();
    setOpenAskDecide(true);
  };

  const handleAskDecideReplace = async () => {
    logger.log("handleAskDecideReplace");
    const isLast = nextConflicting();
    if (isLast) {
      handleClose();
    }
  };

  const handleAskDecideSkip = async () => {
    logger.log("handleAskDecideSkip");
    const isLast = nextConflicting();
    if (isLast) {
      handleClose();
    }
  };

  const handleAskDecideSkipAll = async () => {
    logger.log("handleAskDecideSkipAll");
    handleClose();
  };

  return (
    <>
      {/* IMPORT BUTTON */}
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

      {/* IMPORT DIALOG */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Importing to {resourceName}
        </DialogTitle>
        <DialogContent>
          <div style={{ width: "400px", maxWidth: "100%" }}>
            <p
              style={{
                fontFamily: "sans-serif",
                margin: "0",
                fontSize: "0.9em",
                marginBottom: "10px",
                marginTop: "-7px",
                color: "#555",
              }}
            >
              Importing {values && values.length} items from '{fileName}' to{" "}
              {resourceName}
            </p>
            {isLoading && (
              <div
                style={{
                  textAlign: "center",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                }}
              >
                <CircularProgress variant={"indeterminate"} />
                <p
                  style={{
                    fontFamily: "sans-serif",
                  }}
                >
                  Loading...
                </p>
              </div>
            )}
            {idsConflicting && idsConflicting.length > 0 && !isLoading && (
              <div>
                <p style={{ fontFamily: "sans-serif", margin: "0" }}>
                  The resource <strong>{resourceName}</strong> has{" "}
                  <strong>{idsConflicting && idsConflicting.length}</strong>{" "}
                  records with the same Ids
                </p>
                <List>
                  <BtnOption
                    onClick={handleReplace}
                    icon={<Done htmlColor="#29c130" />}
                    label="Replace the rows"
                  />
                  <BtnOption
                    onClick={handleSkip}
                    icon={<FileCopy htmlColor="#3a88ca" />}
                    label="Skip these rows"
                  />
                  <BtnOption
                    onClick={handleAskDecide}
                    icon={<Undo htmlColor="black" />}
                    label="Let me decide for each row"
                  />
                </List>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* IMPORT ASK DECIDE */}
      <Dialog
        open={openAskDecide}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Importing id {currentValue && currentValue.id} to {resourceName}
        </DialogTitle>
        <DialogContent>
          <div style={{ width: "400px", maxWidth: "100%" }}>
            <p
              style={{
                fontFamily: "sans-serif",
                margin: "0",
                fontSize: "0.9em",
                marginBottom: "10px",
                marginTop: "-7px",
                color: "#555",
              }}
            >
              Importing {values && values.length} items from '{fileName}' to{" "}
              {resourceName}
            </p>
            {isLoading && (
              <div
                style={{
                  textAlign: "center",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                }}
              >
                <CircularProgress variant={"indeterminate"} />
                <p
                  style={{
                    fontFamily: "sans-serif",
                  }}
                >
                  Loading...
                </p>
              </div>
            )}
            {!isLoading && (
              <div>
                <p style={{ fontFamily: "sans-serif", margin: "0" }}>
                  The resource <strong>{resourceName}</strong> has{" "}
                  <strong>{idsConflicting && idsConflicting.length}</strong>{" "}
                  records with the same Ids
                </p>
                <List>
                  <BtnOption
                    onClick={handleAskDecideReplace}
                    icon={<Done htmlColor="#29c130" />}
                    label={
                      "Replace the row id=" + (currentValue && currentValue.id)
                    }
                  />
                  <BtnOption
                    onClick={handleAskDecideSkip}
                    icon={<Undo htmlColor="black" />}
                    label="Skip this row (Don't replace)"
                  />
                  <BtnOption
                    onClick={handleAskDecideSkipAll}
                    icon={<Clear htmlColor="#3a88ca" />}
                    label="Cancel"
                  />
                </List>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

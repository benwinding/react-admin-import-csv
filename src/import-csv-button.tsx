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
import { Done, FileCopy, Undo, Clear, Add } from "@material-ui/icons";
import GetAppIcon from "@material-ui/icons/GetApp";

import { ImportConfig } from "./config.interface";
import { SimpleLogger } from "./SimpleLogger";
import {
  CheckCSVValidation,
  GetCSVItems,
  GetIdsColliding,
} from "./import-controller";
import { create, update } from "./uploader";

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
    throw new Error(translate("csv.buttonMain.emptyResource"));
  }

  if (!label) {
    label = translate("csv.buttonMain.label");
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

  async function updateRows(vals: any[]) {
    return update(
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
    notify(translate("csv.dialogImport.alertClose", { fname: fileName }));
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
      await updateRows(valuesColliding);
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

  const handleAskDecide = async () => {
    logger.log("handleAskDecide");
    setOpen(false);
    nextConflicting();
    setOpenAskDecide(true);
  };

  const nextConflicting = () => {
    const currentId = Array.isArray(idsConflicting) && idsConflicting.pop();
    setIdsConflicting(idsConflicting);
    const foundValue =
      Array.isArray(values) && values.filter((v) => v.id === currentId).pop();
    logger.log("nextConflicting", { foundValue, currentId });
    const isLast = !foundValue;
    if (!isLast) {
      setCurrentValue(foundValue);
    }
    return foundValue && { ...foundValue };
  };

  const handleAskDecideReplace = async () => {
    logger.log("handleAskDecideReplace");
    const val = nextConflicting();
    if (!val) {
      return handleClose();
    }
    await updateRows([val]);
  };

  const handleAskDecideAddAsNew = async () => {
    logger.log("handleAskDecideAddAsNew");
    const val = nextConflicting();
    if (!val) {
      return handleClose();
    }
    delete val.id;
    await createRows([val]);
  };

  const handleAskDecideSkip = async () => {
    logger.log("handleAskDecideSkip");
    const val = nextConflicting();
    if (!val) {
      return handleClose();
    }
    createRows([val]);
  };

  const handleAskDecideSkipAll = async () => {
    logger.log("handleAskDecideSkipAll");
    handleClose();
  };

  return (
    <>
      {/* IMPORT BUTTON */}
      <Tooltip title={translate("csv.buttonMain.tooltip")}>
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
      <MyDialog
        title={translate("csv.dialogImport.title", {
          resource: resourceName,
        })}
        subTitle={translate("csv.dialogCommon.subtitle", {
          count: values && values.length,
          fileName: fileName,
          resource: resourceName,
        })}
        open={open}
        resourceName={resourceName}
        handleClose={handleClose}
      >
        {isLoading && <MyLoader></MyLoader>}
        {idsConflicting && idsConflicting.length > 0 && !isLoading && (
          <div>
            <p
              style={{ fontFamily: "sans-serif", margin: "0" }}
              dangerouslySetInnerHTML={{
                __html: translate("csv.dialogCommon.conflictCount", {
                  resource: resourceName,
                  conflictingCount: idsConflicting && idsConflicting.length + 1,
                }),
              }}
            ></p>
            <List>
              <BtnOption
                onClick={handleReplace}
                icon={<Done htmlColor="#29c130" />}
                label={translate("csv.dialogImport.buttons.replaceAllConflicts")}
              />
              <BtnOption
                onClick={handleSkip}
                icon={<FileCopy htmlColor="#3a88ca" />}
                label={translate("csv.dialogImport.buttons.skipAllConflicts")}
              />
              <BtnOption
                onClick={handleAskDecide}
                icon={<Undo htmlColor="black" />}
                label={translate("csv.dialogImport.buttons.letmeDecide")}
              />
            </List>
          </div>
        )}
      </MyDialog>
      {/* IMPORT ASK DECIDE */}
      <MyDialog
        title={translate("csv.dialogDecide.title", {
          id: currentValue && currentValue.id,
          resource: resourceName,
        })}
        subTitle={translate("csv.dialogCommon.subtitle", {
          count: values && values.length,
          fileName: fileName,
          resource: resourceName,
        })}
        open={openAskDecide}
        resourceName={resourceName}
        handleClose={handleClose}
      >
        {isLoading && <MyLoader></MyLoader>}
        {!isLoading && (
          <div>
            <p
              style={{ fontFamily: "sans-serif", margin: "0" }}
              dangerouslySetInnerHTML={{
                __html: translate("csv.dialogCommon.conflictCount", {
                  resource: resourceName,
                  conflictingCount: idsConflicting && idsConflicting.length + 1,
                }),
              }}
            ></p>
            <List>
              <BtnOption
                onClick={handleAskDecideReplace}
                icon={<Done htmlColor="#29c130" />}
                label={translate("csv.dialogDecide.buttons.replaceRow", {
                  id: currentValue && currentValue.id,
                })}
              />
              <BtnOption
                onClick={handleAskDecideAddAsNew}
                icon={<Add htmlColor="#3a88ca" />}
                label={translate("csv.dialogDecide.buttons.addAsNewRow")}
              />
              <BtnOption
                onClick={handleAskDecideSkip}
                icon={<Undo htmlColor="black" />}
                label={translate("csv.dialogDecide.buttons.skipDontReplace")}
              />
              <BtnOption
                onClick={handleAskDecideSkipAll}
                icon={<Clear htmlColor="#3a88ca" />}
                label={translate("csv.dialogCommon.buttons.cancel")}
              />
            </List>
          </div>
        )}
      </MyDialog>
    </>
  );
};

function MyDialog(props: {
  open: boolean;
  title: string;
  subTitle: string;
  resourceName: string;
  handleClose: () => any;
  children?: any;
}) {
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
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
            {props.subTitle}
          </p>
          {props.children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MyLoader() {
  const translate = useTranslate();
  return (
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
        {translate("csv.loading")}
      </p>
    </div>
  );
}

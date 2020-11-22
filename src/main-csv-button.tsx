import React from "react";
import { useRefresh, useNotify, useDataProvider } from "react-admin";

import { ImportConfig } from "./config.interface";
import { SimpleLogger } from "./SimpleLogger";
import {
  CheckCSVValidation,
  GetCSVItems,
  GetIdsColliding,
} from "./import-controller";
import { create, update } from "./uploader";
import { translateWrapper } from "./translateWrapper";
import { ImportCsvDialogStrategy } from "./components/import-csv-dialog-strategy";
import { ImportCsvDialogEachItem } from "./components/import-csv-dialog-each-item";
import { ImportButton } from "./components/import-button";

export const MainCsvImport = (props: any) => {
  const refresh = useRefresh();
  const translate = translateWrapper();
  const dataProvider = useDataProvider();

  const {
    parseConfig,
    preCommitCallback,
    postCommitCallback,
    validateRow,
  } = props as ImportConfig;
  const logging = !!props.logging;
  let { variant, label, resource, resourceName } = props;
  const logger = new SimpleLogger("import-csv-button", true);
  logger.setEnabled(logging);

  if (!resource) {
    throw new Error(translate("csv.buttonMain.emptyResource"));
  }

  if (!label) {
    label = translate("csv.buttonMain.label", { numb: 99 });
  }

  if (!variant) {
    variant = "text";
  }

  if (!resourceName) {
    resourceName = resource;
  }

  const [open, setOpen] = React.useState(false);
  const [openAskDecide, setOpenAskDecide] = React.useState(false);
  const [values, setValues] = React.useState([] as any[]);
  const [idsConflicting, setIdsConflicting] = React.useState([] as any[]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentValue, setCurrentValue] = React.useState(null as any);

  const [fileName, setFileName] = React.useState('');
  let refInput: HTMLInputElement;

  function resetVars() {
    setOpen(false);
    setOpenAskDecide(false);
    setValues([]);
    setIdsConflicting([]);
    setIsLoading(false);
    setFileName('');
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
    setFileName((file && file.name ) || '');
    setOpen(true);
    try {
      // Is valid csv
      if (!file) {
        throw new Error('File not processed from input field');
      }
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
  };

  const handleAskDecideSkipAll = async () => {
    logger.log("handleAskDecideSkipAll");
    handleClose();
  };

  return (
    <>
      {/* IMPORT BUTTON */}
      <ImportButton
        variant={variant}
        label={label}
        clickImportButton={clickImportButton}
        onFileAdded={onFileAdded}
        onRef={(ref) => (refInput = ref)}
      />

      {/* IMPORT DIALOG */}
      <ImportCsvDialogStrategy
        resourceName={resourceName}
        fileName={fileName}
        count={values && values.length}
        handleClose={handleClose}
        handleReplace={handleReplace}
        handleSkip={handleSkip}
        handleAskDecide={handleAskDecide}
        open={open}
        isLoading={isLoading}
        idsConflicting={idsConflicting}
      />
      {/* IMPORT ASK DECIDE */}
      <ImportCsvDialogEachItem
        currentValue={currentValue}
        resourceName={resourceName}
        values={values}
        fileName={fileName}
        openAskDecide={openAskDecide}
        handleClose={handleClose}
        handleAskDecideReplace={handleAskDecideReplace}
        handleAskDecideAddAsNew={handleAskDecideAddAsNew}
        handleAskDecideSkip={handleAskDecideSkip}
        handleAskDecideSkipAll={handleAskDecideSkipAll}
        isLoading={isLoading}
        idsConflicting={idsConflicting}
      />
    </>
  );
};

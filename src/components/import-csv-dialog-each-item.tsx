import React from "react";
import { SharedDialogButton } from "./SharedDialogButton";
import { SharedDialogWrapper } from "./SharedDialogWrapper";
import { SharedLoader } from "./SharedLoader";
import { translateWrapper } from "../translateWrapper";
import { List } from "@material-ui/core";
import { Done, Undo, Clear, Add } from "@material-ui/icons";

interface ImportCsvDialogEachItemProps {
  currentValue: any;
  resourceName: string;
  values: any[];
  fileName: string;
  openAskDecide: boolean;
  handleClose: () => any;
  handleAskDecideReplace: () => any;
  handleAskDecideAddAsNew: () => any;
  handleAskDecideSkip: () => any;
  handleAskDecideSkipAll: () => any;
  isLoading: boolean;
  idsConflicting: string[];
}

export const ImportCsvDialogEachItem = (props: ImportCsvDialogEachItemProps) => {
  const {
    currentValue,
    resourceName,
    values,
    fileName,
    openAskDecide,
    handleClose,
    handleAskDecideReplace,
    handleAskDecideAddAsNew,
    handleAskDecideSkip,
    handleAskDecideSkipAll,
    isLoading,
    idsConflicting,
  } = props;
  const translate = translateWrapper();

  return (
    <SharedDialogWrapper
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
      handleClose={handleClose}
    >
      {isLoading && <SharedLoader loadingTxt={translate("csv.loading")}></SharedLoader>}
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
            <SharedDialogButton
              onClick={handleAskDecideReplace}
              icon={<Done htmlColor="#29c130" />}
              label={translate("csv.dialogDecide.buttons.replaceRow", {
                id: currentValue && currentValue.id,
              })}
            />
            <SharedDialogButton
              onClick={handleAskDecideAddAsNew}
              icon={<Add htmlColor="#3a88ca" />}
              label={translate("csv.dialogDecide.buttons.addAsNewRow")}
            />
            <SharedDialogButton
              onClick={handleAskDecideSkip}
              icon={<Undo htmlColor="black" />}
              label={translate("csv.dialogDecide.buttons.skipDontReplace")}
            />
            <SharedDialogButton
              onClick={handleAskDecideSkipAll}
              icon={<Clear htmlColor="#3a88ca" />}
              label={translate("csv.dialogCommon.buttons.cancel")}
            />
          </List>
        </div>
      )}
    </SharedDialogWrapper>
  );
};

import React from "react";
import { Button as RAButton } from "react-admin";

import { Tooltip } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import { translateWrapper } from "../translateWrapper";

interface ImportButtonProps {
  variant: "text" | "outlined" | "contained";
  label: string;
  clickImportButton: () => any;
  onFileAdded: (e: React.ChangeEvent<HTMLInputElement>) => any;
  onRef: (el: HTMLInputElement) => any;
}

export function ImportButton(props: ImportButtonProps) {
  const { variant, label, clickImportButton, onFileAdded, onRef } = props;
  const translate = translateWrapper();
  return (
    <Tooltip title={translate("csv.buttonMain.tooltip")}>
      <div>
        <RAButton
          color="primary"
          component="span"
          variant={variant}
          label={label}
          onClick={clickImportButton}
        >
          <GetAppIcon style={{ transform: "rotate(180deg)", fontSize: "20" }} />
        </RAButton>
        <input
          ref={onRef}
          type="file"
          style={{ display: "none" }}
          onChange={onFileAdded}
          accept=".csv,.tsv"
        />
      </div>
    </Tooltip>
  );
}

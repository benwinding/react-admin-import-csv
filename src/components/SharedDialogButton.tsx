import React from "react";
import { Button, ListItem } from "@mui/material";

export function SharedDialogButton(props: {
  onClick: () => void;
  icon: React.ReactElement;
  label: string;
  disabled?: boolean;
}) {
  return (
    <ListItem disableGutters={true}>
      <Button
        disabled={props.disabled}
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
}

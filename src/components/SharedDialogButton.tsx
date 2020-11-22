import React from "react";
import { Button, ListItem } from "@material-ui/core";

export function SharedDialogButton(props: any) {
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
}

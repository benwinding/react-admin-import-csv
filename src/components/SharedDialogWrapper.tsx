import React from "react";
import {
  Dialog,

  DialogContent,
  DialogTitle
} from "@material-ui/core";

export function SharedDialogWrapper(props: {
  open: boolean;
  title: string;
  subTitle: string;
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

import React from "react";
import { CircularProgress } from "@material-ui/core";

export function SharedLoader(props: { loadingTxt: string }) {
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
        {props.loadingTxt}
      </p>
    </div>
  );
}

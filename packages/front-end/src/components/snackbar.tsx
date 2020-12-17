import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps, Color } from "@material-ui/lab/Alert";

interface Props {
  children: any;
  state: boolean;
  setState: (state: boolean) => void;
  severity: Color;
}

const Alert = (props: AlertProps) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

export const AlertSnackbar = ({
  children,
  state,
  setState,
  severity,
}: Props) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={state}
      autoHideDuration={6000}
      onClose={() => {
        setState(false);
      }}
    >
      <Alert
        onClose={() => {
          setState(false);
        }}
        severity={severity}
      >
        {children}
      </Alert>
    </Snackbar>
  );
};

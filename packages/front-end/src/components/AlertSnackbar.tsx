import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps, Color } from "@material-ui/lab/Alert";
import React from "react";

export interface CustomSnackbarProps {
  severity: Color;
}

interface Props extends CustomSnackbarProps {
  state: boolean;
  setState: (state: boolean) => void;
  children: any;
}

const Alert = (props: AlertProps) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const AlertSnackbar = ({ children, state, setState, severity }: Props) => {
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

export default AlertSnackbar;

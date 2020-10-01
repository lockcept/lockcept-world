import { Typography } from "@material-ui/core";
import { AxiosInstance } from "axios";
import React from "react";

interface Props {
  instance: AxiosInstance;
}

function Signup({ instance: _instance }: Props) {
  return (
    <>
      <Typography>Signup</Typography>
    </>
  );
}

export default Signup;

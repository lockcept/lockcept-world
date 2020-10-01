import { Typography } from "@material-ui/core";
import { AxiosInstance } from "axios";
import React from "react";

interface Props {
  instance: AxiosInstance;
}

function Signin({ instance: _instance }: Props) {
  return (
    <>
      <Typography>Signin</Typography>
    </>
  );
}

export default Signin;

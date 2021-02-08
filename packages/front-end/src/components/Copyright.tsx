import { Link, Typography } from "@material-ui/core";
import React from "react";

export const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://lockcept.kr/">
        LOCKCEPT WORLD
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
};

export default Copyright;

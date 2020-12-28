import React, { useMemo } from "react";
import jwt from "jsonwebtoken";
import {
  AppBar,
  Box,
  Button,
  createStyles,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useLockceptContext } from "../../contexts";

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      flexGrow: 1,
    },
  })
);

const MainHeader = () => {
  const classes = useStyles();
  const history = useHistory();

  const { signed, accessToken } = useLockceptContext();
  const userName = useMemo(() => {
    const decoded = jwt.decode(accessToken);
    if (!decoded) return "";
    if (typeof decoded === "string") return "";
    const { userName: decodedUserName } = decoded;
    return decodedUserName;
  }, [accessToken]);
  return (
    <Box id="toolbar">
      <AppBar color="primary" position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Lockcept World
          </Typography>
          {!signed && (
            <Button
              color="inherit"
              onClick={() => {
                history.push("/signin");
              }}
            >
              Sign-in
            </Button>
          )}
          {signed && userName}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default MainHeader;

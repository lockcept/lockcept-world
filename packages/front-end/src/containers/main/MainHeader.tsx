import {
  AppBar,
  Box,
  Button,
  createStyles,
  Link,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { useMemo } from "react";
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

  const { signed, signedUserData } = useLockceptContext();
  const userName = useMemo(() => {
    if (!signedUserData) return "";
    return signedUserData?.userName;
  }, [signedUserData]);
  return (
    <Box id="toolbar">
      <AppBar color="primary" position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link underline="none" color="textPrimary" href="/">
              Lockcept World
            </Link>
          </Typography>
          {!signed && (
            <Button
              color="inherit"
              onClick={() => {
                history.push({
                  pathname: "/signin",
                  search: `?goto=${encodeURI(
                    history.location.pathname + history.location.hash
                  )}`,
                });
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

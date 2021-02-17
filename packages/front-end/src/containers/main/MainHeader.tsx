import {
  AppBar,
  Box,
  Button,
  createStyles,
  Link,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { useMemo, useState } from "react";
import { useHistory, Link as ReactLink } from "react-router-dom";
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

  const { signed, signedUserData, setAccessToken } = useLockceptContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

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
          {signed && (
            <Button
              color="inherit"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                setAnchorEl(event.currentTarget);
              }}
            >
              {userName}
            </Button>
          )}
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              component={ReactLink}
              to="/account"
              onClick={() => {
                handleClose();
              }}
            >
              Account Setting
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                setAccessToken("");
              }}
            >
              Log out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default MainHeader;

import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import {
  HashRouter,
  Redirect,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import Copyright from "../../components/Copyright";
import { useLockceptContext } from "../../contexts";
import AccountDashboardItems from "./AccountDashboardItems";
import DashboardPage from "./DashboardPage";
import ProfilesSettingPage from "./ProfilesSettingPage";
import UsersSettingPage from "./UsersSettingPage";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
  },
  drawerPaper: {
    position: "relative",
    top: "5px",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const { signed } = useLockceptContext();

  useEffect(() => {
    if (!signed)
      history.push({
        pathname: "/signin",
        search: `?goto=${encodeURI(
          history.location.pathname + history.location.hash
        )}`,
      });
  }, [signed, history]);

  return (
    <div className={classes.root}>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          {open && (
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          )}
          {!open && (
            <IconButton onClick={handleDrawerOpen}>
              <ChevronRightIcon />
            </IconButton>
          )}
        </div>
        <AccountDashboardItems />
      </Drawer>
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <HashRouter hashType="noslash">
              <Switch>
                <Route exact path="/">
                  <DashboardPage />
                </Route>
                <Route exact path="/users">
                  <UsersSettingPage />
                </Route>
                <Route exact path="/profiles">
                  <ProfilesSettingPage />
                </Route>
                <Route>
                  <Redirect to="/" />
                </Route>
              </Switch>
            </HashRouter>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
};

export default Dashboard;

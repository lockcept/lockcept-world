import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Box } from "@material-ui/core";
import MainFooter from "./main-footer";
import MainHeader from "./main-header";
import Main from "./main";
import Dashboard from "../account/dashboard";

const MainRouter = () => {
  return (
    <Box>
      <MainHeader />
      <Switch>
        <Route exact path="/">
          <Main />
        </Route>
        <Route path="/account">
          <Dashboard />
        </Route>
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
      <MainFooter />
    </Box>
  );
};

export default MainRouter;

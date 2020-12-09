import React from "react";
import "./App.css";
import Axios from "axios";
import { Redirect, Route, Switch } from "react-router-dom";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { ThemeProvider } from "@material-ui/core/styles";
import Lockcept from "./lockcept";
import Main from "./main";
import Signin from "./auth/signin";
import Signup from "./auth/signup";

const getHttpEndPoints = () => {
  const httpEndPoints = {
    dev: "http://localhost:4000",
    prod: "https://api.lockcept.kr/prod",
  };
  const stage = process.env.REACT_APP_STAGE;
  if (!stage) return httpEndPoints.dev;
  switch (stage) {
    case "prod":
      return httpEndPoints.prod;
    default:
      return httpEndPoints.dev;
  }
};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#5AC0AC",
    },
    secondary: {
      main: "#C06F5A",
    },
  },
});

function App() {
  const instance = Axios.create({
    baseURL: getHttpEndPoints(),
  });
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path="/lockcept">
          <Lockcept instance={instance} />
        </Route>
        <Route exact path="/signin">
          <Signin instance={instance} />
        </Route>
        <Route exact path="/signup">
          <Signup instance={instance} />
        </Route>
        <Route exact path="/">
          <Main />
        </Route>
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;

import React from "react";
import "./App.css";
import { Redirect, Route, Switch } from "react-router-dom";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import Signup from "./routes/auth/signup";
import MainRouter from "./routes/main";
import Signin from "./routes/auth/signin";
import { LockceptContextProvider } from "./contexts";

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

export const authProvider = React.createContext(null);

const App = () => {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <LockceptContextProvider>
          <Switch>
            <Route exact path="/signin">
              <Signin />
            </Route>
            <Route exact path="/signup">
              <Signup />
            </Route>
            <Route path="/">
              <MainRouter />
            </Route>
            <Route>
              <Redirect to="/" />
            </Route>
          </Switch>
        </LockceptContextProvider>
      </ThemeProvider>
    </>
  );
};

export default App;

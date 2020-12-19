import React, { useCallback, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router-dom";
import { SigninLocalRequest, SigninLocalResponse } from "@lockcept/shared";
import { useLockceptContext } from "../../contexts/LockceptContext";
import { errorLogger } from "../../logger";
import { AlertSnackbar } from "../../components";

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

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Signin = () => {
  const classes = useStyles();
  const history = useHistory();
  const { instance, signed, setSigned, setAccessToken } = useLockceptContext();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [signinError, setSigninError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = event.target.value;
    setEmail(inputEmail);
  };
  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputPassword = event.target.value;
    setPassword(inputPassword);
  };
  const handleSignin = useCallback(async () => {
    if (signed) return;
    setLoading(true);
    try {
      const reqBody: SigninLocalRequest = { email, password };
      const res = await instance.post<SigninLocalResponse>(
        "/signin/local",
        reqBody
      );
      const { token } = res.data;
      setAccessToken(token);
      setSigned(true);
      history.push("/");
    } catch (e) {
      errorLogger(e);
      setAccessToken("");
      setSigned(false);
      setSigninError(true);
    }
    setLoading(false);
  }, [email, history, instance, password, setAccessToken, setSigned, signed]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={onEmailChange}
            onKeyPress={(event) => {
              if (event.key === "Enter" && !loading) handleSignin();
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={onPasswordChange}
            onKeyPress={(event) => {
              if (event.key === "Enter" && !loading) handleSignin();
            }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSignin}
            disabled={loading}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/signup" variant="body2">
                Do not have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
        <AlertSnackbar
          state={signinError}
          setState={setSigninError}
          severity="error"
        >
          Failed to Signin
        </AlertSnackbar>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Signin;

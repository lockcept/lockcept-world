import {
  ErrorName,
  SigninLocalRequest,
  SigninLocalResponse,
  validateEmail,
} from "@lockcept/shared";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import queryString from "query-string";
import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import AlertSnackbar from "../../components/AlertSnackbar";
import Copyright from "../../components/Copyright";
import { useLockceptContext } from "../../contexts";
import { errorLogger } from "../../logger";

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
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const query = queryString.parse(history.location.search);

  const onEmailChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputEmail = event.target.value;
      setEmail(inputEmail);
    },
    []
  );
  const onPasswordChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputPassword = event.target.value;
      setPassword(inputPassword);
    },
    []
  );
  const handleSignin = useCallback(async () => {
    if (signed) return;
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      setSigninError(true);
      return;
    }
    setLoading(true);

    let goto = query?.goto;
    if (!goto || typeof goto !== "string") goto = "/";

    try {
      const reqBody: SigninLocalRequest = { email, password };
      const res = await instance.post<SigninLocalResponse>(
        "/signin/local",
        reqBody
      );
      const { token } = res.data;
      setAccessToken(token);
      setSigned(true);
      setLoading(false);
      history.push(goto);
    } catch (e) {
      errorLogger(e);
      setAccessToken("");
      setSigned(false);
      if (e.response) {
        const errorData = e.response.data;
        const errorName = errorData?.options?.name;
        switch (errorName) {
          case ErrorName.InvalidEmail:
            setErrorMessage("Email Not Exists");
            break;
          case ErrorName.InvalidPassword:
            setErrorMessage("Incorrect Password");
            break;
          default:
            setErrorMessage(e.response.message ?? "Unknown Error");
        }
      }
      setLoading(false);
      setSigninError(true);
    }
  }, [
    email,
    history,
    instance,
    password,
    setAccessToken,
    setSigned,
    signed,
    query,
  ]);

  return (
    <Container component="main" maxWidth="xs">
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
          {errorMessage}
        </AlertSnackbar>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Signin;

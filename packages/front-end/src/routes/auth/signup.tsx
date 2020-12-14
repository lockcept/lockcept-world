import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  SignupLocalRequest,
  validateEmail,
  validatePassword,
  validateUserName,
} from "@lockcept/shared";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import { AxiosInstance } from "axios";
import { useHistory } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { errorLogger } from "../logger";

interface Props {
  instance: AxiosInstance;
}

function Alert(props: AlertProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://lockcept.kr/">
        LOCKCEPT WORLD
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Signup({ instance }: Props) {
  const classes = useStyles();
  const history = useHistory();
  const [canSubmit, setCanSubmit] = useState<boolean>(true);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailValidation, setEmailValidation] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [passwordValidation, setPasswordValidation] = useState<string>("");
  const [passwords, setPasswords] = useState<{
    currentPassword: string;
    confirmPassword: string;
  }>({
    currentPassword: "",
    confirmPassword: "",
  });
  const [userNameValidation, setUserNameValidation] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const handleSignup = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { currentPassword } = passwords;
      const req: SignupLocalRequest = {
        userData: { email, password: currentPassword, userName },
      };
      await instance.post("/signup/local", req).catch();
      history.push("/");
    } catch (e) {
      errorLogger(e);
      setSubmitError(true);
    }
    setLoading(false);
  }, [instance, loading, email, passwords, userName, history]);
  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = event.target.value;
    setEmail(inputEmail);
    if (inputEmail === "" || validateEmail(inputEmail)) setEmailValidation("");
    else setEmailValidation("Please enter a valid email address.");
  };
  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    setPasswords((prevState) => ({ ...prevState, currentPassword: password }));

    if (password === "" || validatePassword(password))
      setPasswordValidation("");
    else
      setPasswordValidation(
        "Your password does not meet the password requirements: alphabet, number, 8-16 length"
      );
  };
  const onConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const confirmPassword = event.target.value;
    setPasswords((prevState) => ({ ...prevState, confirmPassword }));
  };
  const confirmPasswordValidation = useMemo(() => {
    if (passwords.currentPassword === passwords.confirmPassword) return "";
    return "Your passwords are not equal";
  }, [passwords]);

  useEffect(() => {
    setCanSubmit(
      !loading &&
        emailValidation.length === 0 &&
        email.length > 0 &&
        passwordValidation.length === 0 &&
        passwords.currentPassword.length > 0 &&
        confirmPasswordValidation.length === 0 &&
        userNameValidation.length === 0 &&
        userName.length > 0
    );
  }, [
    loading,
    emailValidation,
    email,
    passwordValidation,
    passwords,
    confirmPasswordValidation,
    userNameValidation,
    userName,
  ]);

  const onUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputUserName = event.target.value;
    setUserName(inputUserName);
    if (inputUserName === "" || validateUserName(inputUserName))
      setUserNameValidation("");
    else
      setUserNameValidation(
        "Your username does not meet the username requirements: alphabet, number, 6-16 length"
      );
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar} />
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                placeholder="lockcept@gmail.com"
                error={emailValidation.length > 0}
                helperText={emailValidation}
                onChange={onEmailChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={passwordValidation.length > 0}
                helperText={passwordValidation}
                onChange={onPasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirm-password"
                label="Confirm Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={confirmPasswordValidation.length > 0}
                helperText={confirmPasswordValidation}
                onChange={onConfirmPasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="user-name"
                label="User Name"
                name="user-name"
                autoComplete="username"
                placeholder="lockcept"
                error={userNameValidation.length > 0}
                helperText={userNameValidation}
                onChange={onUserNameChange}
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSignup}
            disabled={!canSubmit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={submitError}
          autoHideDuration={6000}
          onClose={() => {
            setSubmitError(false);
          }}
        >
          <Alert
            onClose={() => {
              setSubmitError(false);
            }}
            severity="error"
          >
            Already exist
          </Alert>
        </Snackbar>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default Signup;

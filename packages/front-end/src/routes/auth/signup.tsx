import React, { useCallback, useMemo, useState } from "react";
import {
  ErrorName,
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
import { useHistory } from "react-router-dom";
import { errorLogger } from "../../logger";
import { useLockceptContext } from "../../contexts";
import { AlertSnackbar, Copyright } from "../../components";

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

const Signup = () => {
  const classes = useStyles();
  const history = useHistory();
  const { instance } = useLockceptContext();
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
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
      await instance.post("/signup/local", req);
      history.push("/");
    } catch (e) {
      errorLogger(e);
      if (e.response) {
        const errorData = e.response.data;
        const errorName = errorData?.options?.name;
        switch (errorName) {
          case ErrorName.ExistingEmail:
            setErrorMessage("Email Already Exists");
            break;
          case ErrorName.ExistingUserName:
            setErrorMessage("UserName Already Exists");
            break;
          default:
            setErrorMessage(e.response.message ?? "Unknown Error");
        }
      }
      setSubmitError(true);
    }
    setLoading(false);
  }, [loading, passwords, email, userName, instance, history]);

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = event.target.value;
    setEmail(inputEmail);
  };
  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    setPasswords((prevState) => ({ ...prevState, currentPassword: password }));
  };
  const onConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const confirmPassword = event.target.value;
    setPasswords((prevState) => ({ ...prevState, confirmPassword }));
  };

  const emailValidation = useMemo(() => {
    if (email === "" || validateEmail(email)) return "";
    return "Please enter a valid email address.";
  }, [email]);

  const passwordValidation = useMemo(() => {
    const password = passwords.currentPassword;
    if (password === "" || validatePassword(password)) return "";
    return "Your password does not meet the password requirements: alphabet, number, 8-16 length";
  }, [passwords]);
  const confirmPasswordValidation = useMemo(() => {
    if (passwords.currentPassword === passwords.confirmPassword) return "";
    return "Your passwords are not equal";
  }, [passwords]);

  const canSubmit = useMemo(() => {
    return (
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
                autoFocus
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                placeholder="lockcept@gmail.com"
                error={emailValidation.length > 0}
                helperText={emailValidation}
                onChange={onEmailChange}
                onKeyPress={(event) => {
                  if (event.key === "Enter" && canSubmit) handleSignup();
                }}
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
                onKeyPress={(event) => {
                  if (event.key === "Enter" && canSubmit) handleSignup();
                }}
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
                id="confirm-password"
                autoComplete="current-password"
                error={confirmPasswordValidation.length > 0}
                helperText={confirmPasswordValidation}
                onChange={onConfirmPasswordChange}
                onKeyPress={(event) => {
                  if (event.key === "Enter" && canSubmit) handleSignup();
                }}
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
                onKeyPress={(event) => {
                  if (event.key === "Enter" && canSubmit) handleSignup();
                }}
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
        <AlertSnackbar
          state={submitError}
          setState={setSubmitError}
          severity="error"
        >
          {errorMessage}
        </AlertSnackbar>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Signup;

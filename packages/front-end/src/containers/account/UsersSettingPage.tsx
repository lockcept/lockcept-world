import {
  ErrorName,
  SigninLocalResponse,
  UpdateEmailRequest,
  UserData,
  UserDataResponse,
  validateEmail,
} from "@lockcept/shared";
import {
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  makeStyles,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import AlertSnackbar from "../../components/AlertSnackbar";

import { useLockceptContext } from "../../contexts";
import { errorLogger } from "../../logger";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
  },
}));

const UserSettingPage = () => {
  const classes = useStyles();
  const {
    instance,
    setAccessToken,
    signedUserData,
    setSnackbar,
  } = useLockceptContext();

  const [userData, setUserData] = useState<Omit<
    UserData,
    "id" | "password"
  > | null>(null);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const userId = useMemo(() => {
    if (!signedUserData) return null;
    return signedUserData?.id;
  }, [signedUserData]);

  useEffect(() => {
    if (!userId) {
      setUserData(null);
      return;
    }
    instance
      .get<UserDataResponse>(`/user/users/${userId}`)
      .then((res) => {
        setUserData(res.data.userData);
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 404) {
            setUserData(null);
          }
        }
      });
  }, [instance, userId]);

  useEffect(() => {
    if (!userData) {
      setEmail("");
      setUserName("");
      return;
    }
    setEmail(userData?.email);
    setUserName(userData?.userName);
  }, [userData]);

  const handleEmailUpdate = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const req: UpdateEmailRequest = {
        email,
      };
      const res = await instance.post<SigninLocalResponse>(
        `/user/users/${userId}/email`,
        req
      );
      const { token } = res.data;
      setAccessToken(token);
      setLoading(false);
      setEmail(email);
      setSnackbar({ severity: "info" }, "Success to Update Email");
    } catch (e) {
      errorLogger(e);
      if (e.response) {
        const errorData = e.response.data;
        const errorName = errorData?.options?.name;
        switch (errorName) {
          case ErrorName.ExistingEmail:
            setErrorMessage("Email Already Exists");
            break;
          case ErrorName.InvalidEmail:
            setErrorMessage("Please enter a valid email address.");
            break;
          default:
            setErrorMessage(e.response.message ?? "Unknown Error");
        }
        setSubmitError(true);
      }
      setLoading(false);
    }
  }, [email, instance, loading, setAccessToken, setSnackbar, userId]);

  const handlePasswordUpdate = useCallback(() => {
    console.log(userData);
  }, [userData]);

  const handleUserNameUpdate = useCallback(() => {
    console.log(userData?.userName);
  }, [userData]);

  const emailValidation = useMemo(() => {
    if (email === "" || validateEmail(email)) return "";
    return "Please enter a valid email address.";
  }, [email]);

  return (
    <Container maxWidth="lg">
      <Card className={classes.card}>
        <Toolbar>
          <Typography variant="subtitle1" color="textSecondary">
            User
          </Typography>
          <Box flex={1} />
        </Toolbar>
        <CardContent>
          <Box display="flex">
            <Box flexGrow={1}>
              <TextField
                variant="outlined"
                fullWidth
                id="email"
                label="Update Email Address"
                name="email"
                value={email}
                error={emailValidation.length > 0}
                helperText={emailValidation}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Box>
            <IconButton
              onClick={handleEmailUpdate}
              disabled={emailValidation.length > 0 || !email}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
      <AlertSnackbar
        state={submitError}
        setState={setSubmitError}
        severity="error"
      >
        {errorMessage}
      </AlertSnackbar>
    </Container>
  );
};

export default UserSettingPage;

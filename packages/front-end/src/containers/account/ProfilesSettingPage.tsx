import {
  AccountData,
  AccountDataResponse,
  ErrorName,
  UpdateAccountRequest,
  validateAccountData,
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

import { useLockceptContext } from "../../contexts";
import { errorLogger } from "../../logger";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
  },
}));

const ProfilesSettingPage = () => {
  const classes = useStyles();
  const { instance, signedUserData, setSnackbar } = useLockceptContext();

  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const userId = useMemo(() => {
    if (!signedUserData) return null;
    return signedUserData?.id;
  }, [signedUserData]);

  useEffect(() => {
    if (!userId) {
      setAccountData(null);
      return;
    }
    instance
      .get<AccountDataResponse>(`/account/users/${userId}`)
      .then((res) => {
        setAccountData(res.data.accountData);
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 404) {
            setAccountData(null);
          }
        }
      });
  }, [instance, userId]);

  const handleAccountUpdate = useCallback(async () => {
    if (loading) return;
    if (!accountData) return;
    setLoading(true);
    try {
      const req: UpdateAccountRequest = {
        accountData,
      };
      await instance.patch(`/account/users/${userId}`, req);
      setLoading(false);
      setSnackbar({ severity: "info" }, "Success to Update Account");
    } catch (e) {
      errorLogger(e);
      if (e.response) {
        const errorData = e.response.data;
        const errorName = errorData?.options?.name;
        switch (errorName) {
          case ErrorName.InvalidAccount:
            setSnackbar(
              { severity: "error" },
              "Please enter a valid account profiles."
            );
            break;
          default:
            setSnackbar(
              { severity: "error" },
              e.response.message ?? "Unknown Error"
            );
        }
      }
      setLoading(false);
    }
  }, [accountData, instance, loading, setSnackbar, userId]);

  const accountValidation = useMemo(() => {
    if (!accountData || validateAccountData(accountData)) return "";
    return "Please enter a valid account profiles.";
  }, [accountData]);

  return (
    <Container maxWidth="lg">
      <Card className={classes.card}>
        <Box display="flex">
          <Box flexGrow={1}>
            <Toolbar>
              <Typography variant="subtitle1" color="textSecondary">
                Update Account Profiles
              </Typography>
              <Box flex={1} />
            </Toolbar>
          </Box>
          <IconButton
            onClick={handleAccountUpdate}
            disabled={accountValidation.length > 0 || !accountData}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
        {accountData && (
          <CardContent>
            <Box display="flex">
              <Box flexGrow={1}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="site"
                  label="Site"
                  name="site"
                  defaultValue={accountData.site}
                  error={accountValidation.length > 0}
                  helperText={accountValidation}
                  onChange={(e) => {
                    if (!accountData) return;
                    setAccountData({ ...accountData, site: e.target.value });
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        )}
        {accountData && (
          <CardContent>
            <Box display="flex">
              <Box flexGrow={1}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="comment"
                  label="Comment"
                  name="comment"
                  defaultValue={accountData.comment}
                  error={accountValidation.length > 0}
                  helperText={accountValidation}
                  onChange={(e) => {
                    if (!accountData) return;
                    setAccountData({ ...accountData, comment: e.target.value });
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        )}
      </Card>
    </Container>
  );
};

export default ProfilesSettingPage;

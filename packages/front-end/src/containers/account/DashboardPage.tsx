import {
  AccountData,
  AccountDataResponse,
  UserData,
  UserDataResponse,
} from "@lockcept/shared";
import {
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Toolbar,
  Typography,
} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import { useLockceptContext } from "../../contexts";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
  },
}));

const DashboardPage = () => {
  const classes = useStyles();
  const { instance, signedUserData } = useLockceptContext();
  const history = useHistory();

  const [userData, setUserData] = useState<Omit<
    UserData,
    "id" | "password"
  > | null>(null);
  const [accountData, setAccountData] = useState<AccountData | null>(null);

  const userId = useMemo(() => {
    if (!signedUserData) return null;
    return signedUserData?.id;
  }, [signedUserData]);

  useEffect(() => {
    if (!userId) {
      setUserData(null);
      setAccountData(null);
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

  return (
    <Container maxWidth="lg">
      <Card className={classes.card}>
        <Toolbar>
          <Typography variant="subtitle1" color="textSecondary">
            User
          </Typography>
          <Box flex={1} />
          <IconButton
            onClick={() => {
              history.push("#users");
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Toolbar>
        {userData && (
          <CardContent>
            <Table>
              <TableBody>
                <TableRow key="email">
                  <TableCell width="10%">Email</TableCell>
                  <TableCell>{userData?.email}</TableCell>
                </TableRow>
                <TableRow key="user-name">
                  <TableCell width="10%">Name</TableCell>
                  <TableCell>{userData?.userName}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
      <Card className={classes.card}>
        <Toolbar>
          <Typography variant="subtitle1" color="textSecondary">
            Profile
          </Typography>
          <Box flex={1} />
          <IconButton
            onClick={() => {
              history.push("#profiles");
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Toolbar>
        {accountData && (
          <CardContent>
            <Table>
              <TableBody>
                <TableRow key="site">
                  <TableCell width="10%">Site</TableCell>
                  <TableCell>{accountData?.site}</TableCell>
                </TableRow>
                <TableRow key="comment">
                  <TableCell width="10%">Comment</TableCell>
                  <TableCell>{accountData?.comment}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
    </Container>
  );
};

export default DashboardPage;

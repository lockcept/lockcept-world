import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { Link, List } from "@material-ui/core";

const AccountDashboardItems = () => {
  return (
    <List>
      <ListItem button component={Link} href="#" color="textPrimary">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button component={Link} href="#users" color="textPrimary">
        <ListItemIcon>
          <SupervisorAccountIcon />
        </ListItemIcon>
        <ListItemText primary="Users & Accounts" />
      </ListItem>
      <ListItem button component={Link} href="#accounts" color="textPrimary">
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary="Profiles & Accounts" />
      </ListItem>
    </List>
  );
};

export default AccountDashboardItems;

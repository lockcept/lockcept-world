import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  createStyles,
  Grid,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { AxiosInstance } from "axios";
import React from "react";
import { useHistory } from "react-router-dom";
import { services } from "./services";

interface Props {
  instance?: AxiosInstance;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      flexGrow: 1,
    },
    serviceGrid: {
      padding: theme.spacing(1),
    },
    serviceCard: {
      height: "100%",
      flexDirection: "column",
      display: "flex",
    },
    serviceMedia: {
      height: 90,
      paddingTop: theme.spacing(1),
      objectFit: "contain",
    },
    serviceContent: {
      flex: "1 0 auto",
    },
  })
);

function Main({ instance: _instance }: Props) {
  const classes = useStyles();
  const history = useHistory();
  const serviceItems = services;
  return (
    <>
      <Box id="toolbar">
        <AppBar color="primary" position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Lockcept World
            </Typography>
            <Button
              color="inherit"
              onClick={() => {
                history.push("/signin");
              }}
            >
              Sign-in
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Box id="service" m={5}>
        <Container maxWidth="lg">
          <Grid container>
            {serviceItems.map((service) => {
              return (
                <Grid
                  key={service.id}
                  className={classes.serviceGrid}
                  item
                  xs={12}
                  sm={6}
                  md={3}
                >
                  <Card
                    elevation={3}
                    className={classes.serviceCard}
                    id="services"
                  >
                    <CardMedia
                      className={classes.serviceMedia}
                      component="img"
                      alt={service.id}
                      image={`/img/services/${service.image}`}
                    />
                    <CardHeader title={service.name} />
                    <CardContent className={classes.serviceContent}>
                      <Typography color="textPrimary" gutterBottom>
                        {service.content}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => history.push(service.link)}
                      >
                        Learn More
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>
      <Box id="link" />
    </>
  );
}

Main.defaultProps = {
  instance: null,
};

export default Main;

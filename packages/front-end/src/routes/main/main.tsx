import {
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
  Typography,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { links, services } from "./services";

const useStyles = makeStyles((theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      minHeight: "100vh",
      overflow: "auto",
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

const Main = () => {
  const classes = useStyles();
  const history = useHistory();
  const serviceItems = services;
  const linkItems = links;

  return (
    <Box className={classes.content}>
      <Box id="service" m={5}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center">
            Service
          </Typography>
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
      <Box id="link" m={5}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center">
            Link
          </Typography>
          <Grid container>
            {linkItems.map((link) => {
              return (
                <Grid
                  key={link.id}
                  className={classes.serviceGrid}
                  item
                  xs={12}
                  sm={6}
                  md={3}
                >
                  <Card
                    elevation={3}
                    className={classes.serviceCard}
                    id="links"
                  >
                    <CardMedia
                      className={classes.serviceMedia}
                      component="img"
                      alt={link.id}
                      image={`/img/services/${link.image}`}
                    />
                    <CardHeader title={link.name} />
                    <CardContent className={classes.serviceContent}>
                      <Typography color="textPrimary" gutterBottom>
                        {link.content}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => history.push(link.link)}
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
    </Box>
  );
};

export default Main;

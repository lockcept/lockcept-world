import { Box, createStyles, Link, makeStyles } from "@material-ui/core";
import React from "react";

interface Contact {
  icon: string;
  link: string;
}

const contacts: Contact[] = [
  { icon: "github.svg", link: "https://github.com/lockcept" },
  { icon: "instagram.svg", link: "https://www.instagram.com/lockcept" },
  { icon: "tistory.svg", link: "https://blog.lockcept.kr" },
  { icon: "linkedin.svg", link: "https://www.linkedin.com/in/lockcept/" },
];
const useStyles = makeStyles((theme) =>
  createStyles({
    websiteFooter: {
      background: theme.palette.primary.main,
    },
    contactImage: {
      margin: theme.spacing(1),
    },
  })
);

function Footer() {
  const classes = useStyles();
  return (
    <>
      <Box
        id="footer"
        display="flex"
        justifyContent="center"
        mt={5}
        className={classes.websiteFooter}
      >
        {contacts.map((contact) => {
          return (
            <Link key={contact.icon} href={contact.link}>
              <img
                className={classes.contactImage}
                height={30}
                alt={contact.icon}
                src={`/img/links/${contact.icon}`}
              />
            </Link>
          );
        })}
      </Box>
    </>
  );
}

Footer.defaultProps = {
  instance: null,
};

export default Footer;

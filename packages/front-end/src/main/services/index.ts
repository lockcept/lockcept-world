interface service {
  id: string;
  name: string;
  content: string;
  link: string;
  image: string;
}

const services: service[] = [
  {
    id: `account`,
    name: `Account`,
    content: `Sign in Your Own Account`,
    link: `/signin`,
    image: `lockcept.svg`,
  },
  {
    id: `league-of-legend`,
    name: `LOL Stats`,
    content: `League of Legend Match History`,
    link: `/lol`,
    image: `lol.svg`,
  },
  {
    id: `homework-planner`,
    name: `Homework Planner`,
    content: `Design Your Homework`,
    link: `/hwplan`,
    image: `lockcept.png`,
  },
  {
    id: `comming-soon`,
    name: `comming-soon`,
    content: `Comming Soon`,
    link: `/`,
    image: `lockcept.svg`,
  },
] as service[];

export { services };

interface Service {
  id: string;
  name: string;
  content: string;
  link: string;
  image: string;
}

const services: Service[] = [
  {
    id: `account`,
    name: `Account`,
    content: `Account Settings`,
    link: `/account`,
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
    image: `lockcept.svg`,
  },
  {
    id: `comming-soon-1`,
    name: `comming-soon`,
    content: `Comming Soon`,
    link: `/`,
    image: `lockcept.png`,
  },
  {
    id: `comming-soon-2`,
    name: `comming-soon`,
    content: `Comming Soon`,
    link: `/`,
    image: `lockcept.png`,
  },
  {
    id: `comming-soon-3`,
    name: `comming-soon`,
    content: `Comming Soon`,
    link: `/`,
    image: `lockcept.png`,
  },
  {
    id: `comming-soon-4`,
    name: `comming-soon`,
    content: `Comming Soon`,
    link: `/`,
    image: `lockcept.png`,
  },
  {
    id: `comming-soon-5`,
    name: `comming-soon`,
    content: `Comming Soon`,
    link: `/`,
    image: `lockcept.png`,
  },
] as Service[];

const links: Service[] = [
  {
    id: `comming-soon-1`,
    name: `comming-soon`,
    content: `Comming Soon`,
    link: `/`,
    image: `lockcept.png`,
  },
  {
    id: `comming-soon=2`,
    name: `comming-soon`,
    content: `Comming Soon`,
    link: `/`,
    image: `lockcept.png`,
  },
  {
    id: `comming-soon-3`,
    name: `comming-soon`,
    content: `Comming Soon`,
    link: `/`,
    image: `lockcept.png`,
  },
];

export { services, links };

import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Lockcept from "./lockcept";
import Axios from "axios";

const getHttpEndPoints = () => {
  const httpEndPoints = {
    dev: "http://localhost:4000/dev",
    prod: "https://api.lockcept.kr/prod",
  };
  const stage = process.env.REACT_APP_STAGE;
  console.log(stage);
  if (!stage) return httpEndPoints.dev;
  switch (stage) {
    case "prod":
      return httpEndPoints.prod;
    default:
      return httpEndPoints.dev;
  }
};

function App() {
  const instance = Axios.create({
    baseURL: getHttpEndPoints(),
  });
  return (
    <div>
      <Lockcept instance={instance}></Lockcept>
    </div>
  );
}

export default App;

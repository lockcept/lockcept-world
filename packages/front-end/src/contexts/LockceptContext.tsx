import Axios, { AxiosInstance } from "axios";
import React, { createContext, useContext, useState } from "react";

const getHttpEndPoints = () => {
  const httpEndPoints = {
    dev: "http://localhost:4000",
    prod: "https://api.lockcept.kr/prod",
    stg: "https://api.lockcept.kr/stg",
  };
  const stage = process.env.REACT_APP_STAGE;
  if (!stage) return httpEndPoints.dev;
  switch (stage) {
    case "prod":
      return httpEndPoints.prod;
    case "stg":
      return httpEndPoints.stg;
    default:
      return httpEndPoints.dev;
  }
};

export interface LockceptContextProps {
  instance: AxiosInstance;
  signed: boolean;
  setSigned: (signed: boolean) => void;
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
}
const LockceptContext = createContext<LockceptContextProps>({
  instance: Axios.create({
    baseURL: getHttpEndPoints(),
  }),
  signed: false,
  setSigned: () => {},
  accessToken: "",
  setAccessToken: () => {},
});

export const useLockceptContext = () => useContext(LockceptContext);

interface Props {
  children: any;
}

export const LockceptContextProvider = ({ children }: Props): JSX.Element => {
  const { instance } = useLockceptContext();
  const [signed, setSigned] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const value = {
    instance,
    signed,
    setSigned,
    accessToken,
    setAccessToken,
  };
  return (
    <LockceptContext.Provider value={value}>
      {children}
    </LockceptContext.Provider>
  );
};

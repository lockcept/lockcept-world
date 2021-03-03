import { UserData } from "@lockcept/shared";
import Axios, { AxiosInstance } from "axios";
import jwt from "jsonwebtoken";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AlertSnackbar, {
  CustomSnackbarProps,
} from "../components/AlertSnackbar";

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
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
  signedUserData: Omit<UserData, "password"> | null;
  setSnackbar: (props: CustomSnackbarProps, message: string) => void;
}
const LockceptContext = createContext<LockceptContextProps>({
  instance: Axios.create({
    baseURL: getHttpEndPoints(),
  }),
  signed: false,
  accessToken: "",
  setAccessToken: () => {},
  signedUserData: null,
  setSnackbar: () => {},
});

export const useLockceptContext = () => useContext(LockceptContext);

interface Props {
  children: any;
}

export const LockceptContextProvider = ({ children }: Props): JSX.Element => {
  const [signed, setSigned] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [customSnackbarProps, setCustomSnackbarProps] = useState<
    (CustomSnackbarProps & { message: string }) | null
  >();
  const [snackbarState, setSnackBarState] = useState<boolean>(false);
  const instance = useMemo(
    () =>
      Axios.create({
        baseURL: getHttpEndPoints(),
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    [accessToken]
  );

  const signedUserData: UserData | null = useMemo(() => {
    if (!accessToken) return null;
    const decoded = jwt.decode(accessToken);
    if (!decoded) return null;
    if (typeof decoded === "string") return null;
    return decoded as UserData;
  }, [accessToken]);

  const setSnackbar = (props: CustomSnackbarProps, message: string) => {
    setSnackBarState(true);
    setCustomSnackbarProps({ ...props, message });
  };

  useEffect(() => {
    const storageAccessToken = localStorage.getItem("userAccessToken");
    if (storageAccessToken) {
      const decoded = jwt.decode(storageAccessToken);
      if (!decoded) return;
      if (typeof decoded === "string") return;
      if (decoded.exp < Date.now() / 1000) return;

      setAccessToken(storageAccessToken);
      setSigned(true);
    }
  }, []);

  const setAccessTokenWithStorage = (inputAccessToken: string) => {
    localStorage.setItem("userAccessToken", inputAccessToken);
    setAccessToken(inputAccessToken);
    if (inputAccessToken) setSigned(true);
    else setSigned(false);
  };

  const value = {
    instance,
    signed,
    accessToken,
    setAccessToken: setAccessTokenWithStorage,
    signedUserData,
    setSnackbar,
  };
  return (
    <LockceptContext.Provider value={value}>
      {children}
      {customSnackbarProps && snackbarState && (
        <AlertSnackbar
          state={snackbarState}
          setState={setSnackBarState}
          severity={customSnackbarProps.severity}
        >
          {customSnackbarProps.message}
        </AlertSnackbar>
      )}
    </LockceptContext.Provider>
  );
};

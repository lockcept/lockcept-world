import { Typography } from "@material-ui/core";
import { AxiosInstance } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { CreateUserRequest, CreateUserResponse } from "@lockcept/shared";
import { errorLogger } from "../logger";

interface Props {
  instance: AxiosInstance;
}

function Signup({ instance }: Props) {
  const [ifCreated, setIfCreated] = useState<boolean>(false);
  const [ifExist, setIfExist] = useState<boolean>(false);

  const signup = useCallback(async () => {
    const userData = {
      id: "lockcept",
      password: "lockcept",
      nickname: "lockcept",
    };
    const reqBody: CreateUserRequest = { userData };
    try {
      const res = await instance.post<CreateUserResponse>("/users", reqBody);
      setIfCreated(res.data.ifCreated);
    } catch (e) {
      errorLogger(e);
    }
  }, [instance]);

  useEffect(() => {
    signup();
  }, [signup]);

  return (
    <>
      <Typography>{JSON.stringify(ifCreated)}</Typography>
    </>
  );
}

export default Signup;

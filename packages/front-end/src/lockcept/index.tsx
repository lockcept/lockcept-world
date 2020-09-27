import { AxiosInstance } from "axios";
import React, { useCallback, useEffect, useState } from "react";

interface Props {
  instance: AxiosInstance;
}

function Lockcept({ instance }: Props) {
  const [text, setText] = useState<string>("");

  const getData = useCallback(async () => {
    const res = await instance.get("/lockcept");
    return setText(JSON.stringify(res.data));
  }, [instance]);

  useEffect(() => {
    getData();
  }, [getData]);

  return <h3>{text}</h3>;
}

export default Lockcept;

import { useEffect, useState } from "react";

export function useMount() {
  const [mount, setMount] = useState(false);
  useEffect(() => {
    setMount(true);
  }, []);

  return mount;
}

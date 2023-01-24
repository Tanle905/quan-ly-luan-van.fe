import { Layout } from "antd";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { LOCAL_STORAGE } from "../../../constants/local_storage_key";
import { userState } from "../../../stores/auth.store";
import { MCHeaderLeft } from "../../molecules/header/header-left.molecule";
import { MCHeaderRight } from "../../molecules/header/header-right.module";

export function OGHeader({}) {
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    if (!localStorage.getItem(LOCAL_STORAGE.USER_DATA)) return;
    const userData = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE.USER_DATA) as string
    );
    setUser(userData);
  }, []);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(LOCAL_STORAGE.USER_DATA, JSON.stringify(user));
  }, [user]);

  return (
    <Layout.Content className="flex justify-between px-20 py-1 bg-white shadow-sm">
      <MCHeaderLeft />
      <MCHeaderRight />
    </Layout.Content>
  );
}

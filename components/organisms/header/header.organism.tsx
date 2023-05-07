import { Layout } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import useSWR from "swr";
import { PROFILE_ENDPOINT } from "../../../constants/endpoints";
import { LOCAL_STORAGE } from "../../../constants/local_storage_key";
import { reloadProfileSubject } from "../../../constants/observables";
import { userState } from "../../../stores/auth.store";
import { MCHeaderLeft } from "../../molecules/header/header-left.molecule";
import { MCHeaderRight } from "../../molecules/header/header-right.module";

export function OGHeader({}) {
  const [user, setUser] = useRecoilState<any>(userState);
  const { data, mutate } = useSWR(PROFILE_ENDPOINT.BASE, profileFetcher);

  useEffect(() => {
    if (!localStorage.getItem(LOCAL_STORAGE.USER_DATA)) return;
    const userData = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE.USER_DATA) as string
    );
    setUser(userData);
  }, []);

  useEffect(() => {
    const reloadProfileSubscription = reloadProfileSubject.subscribe({
      next: () => {
        mutate();
      },
    });

    return () => {
      reloadProfileSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    setUser((prevUser: any) => {
      return { ...prevUser, ...data };
    });
  }, [data]);

  useEffect(() => {
    if (!user) return;

    localStorage.setItem(LOCAL_STORAGE.USER_DATA, JSON.stringify(user));
  }, [user]);

  async function profileFetcher() {
    if (!axios.defaults.headers.common["Authorization"]) return;

    const res = await axios.get(
      process.env.NEXT_PUBLIC_BASE_URL + PROFILE_ENDPOINT.BASE
    );

    return res.data;
  }

  return (
    <Layout.Content className="flex justify-between px-5 sm:px-20 py-1 bg-white shadow-sm">
      <MCHeaderLeft />
      <MCHeaderRight />
    </Layout.Content>
  );
}

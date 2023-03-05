import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ConfigProvider, message } from "antd";
import { INDIGO_600 } from "../constants/colors";
import { RecoilRoot } from "recoil";
import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  loginRouteProtection,
  calendarRouteProtection,
  adminRouteProtection,
} from "../utils/route-protection.util";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import { getToken } from "../utils/local-storage.util";
import vi from "dayjs/locale/vi";
import axios from "axios";

export default function App({ Component, pageProps }: AppProps) {
  dayjs.extend(LocalizedFormat);
  dayjs.extend(utc);
  dayjs.locale(vi);
  const router = useRouter();
  const [msg, contextHolder] = message.useMessage();

  useEffect(() => {
    //attach token if exist
    const token = getToken();
    if (token) axios.defaults.headers.common["Authorization"] = token;
    else axios.defaults.headers.common["Authorization"] = null;
    //route protection
    loginRouteProtection(router);
    calendarRouteProtection(router);
    adminRouteProtection(router);
  }, [router.pathname]);

  return (
    <>
      {contextHolder}
      <ConfigProvider theme={{ token: { colorPrimary: INDIGO_600 } }}>
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </ConfigProvider>
    </>
  );
}

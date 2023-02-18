import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ConfigProvider } from "antd";
import { INDIGO_600 } from "../constants/colors";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  loginRouteProtection,
  calendarRouteProtection,
} from "../utils/route-protection.util";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { getToken } from "../utils/local-storage.util";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { firebaseState } from "../stores/firebase.store";

export default function App({ Component, pageProps }: AppProps) {
  dayjs.extend(LocalizedFormat);
  const router = useRouter();
  const setFirebase = useSetRecoilState<any>(firebaseState);

  useEffect(() => {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: "quanliluanvan.firebaseapp.com",
      projectId: "quanliluanvan",
      storageBucket: "quanliluanvan.appspot.com",
      messagingSenderId: "601918065674",
      appId: "1:601918065674:web:a5c8d4cd22ae70c55f63f3",
    };
    const app = initializeApp(firebaseConfig);

    setFirebase(app);
  }, []);

  useEffect(() => {
    //attach token if exist
    const token = getToken();
    if (token) axios.defaults.headers.common["Authorization"] = token;
    else axios.defaults.headers.common["Authorization"] = null;
    //route protection
    loginRouteProtection(router);
    calendarRouteProtection(router);
  }, [router.pathname]);

  return (
    <ConfigProvider theme={{ token: { colorPrimary: INDIGO_600 } }}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </ConfigProvider>
  );
}

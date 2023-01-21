import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ConfigProvider } from "antd";
import { INDIGO_600 } from "../constants/colors";
import { RecoilRoot } from "recoil";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { loginRouteProtection } from "../utils/route-protection.util";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    loginRouteProtection(router);
  }, [router.pathname]);

  return (
    <ConfigProvider theme={{ token: { colorPrimary: INDIGO_600 } }}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </ConfigProvider>
  );
}

import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ConfigProvider } from "antd";
import { INDIGO_600 } from "../constants/colors";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: INDIGO_600 } }}>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

import { Layout } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import { OGHeader } from "../../components/organisms/header/header.organism";
import { OGPRofileContent } from "../../components/organisms/content/profile-content.organism";
const { Content } = Layout;

export default function Home() {
  const router = useRouter();
  const { pid } = router.query;

  if (!router.query.pid) return null;

  return (
    <>
      <Head>
        <title>Quản lý luận văn</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Content className="h-screen overflow-auto bg-gray-100">
        <OGHeader />
        <OGPRofileContent userId={pid as string} />
      </Content>
    </>
  );
}

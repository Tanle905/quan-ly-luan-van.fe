import { Layout } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import { OGThesisProgressContent } from "../../components/organisms/content/thesis-progress-content.organism";
import { OGHeader } from "../../components/organisms/header/header.organism";

const { Content } = Layout;
export default function Home() {
  const router = useRouter();

  if (!router.query.pid) return;

  return (
    <>
      <Head>
        <title>Quản lý luận văn</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Content className="min-h-screen bg-gray-100">
        <OGHeader />
        <Content className="my-5">
          <OGThesisProgressContent MSSV={router.query.pid as string} />
        </Content>
      </Content>
    </>
  );
}
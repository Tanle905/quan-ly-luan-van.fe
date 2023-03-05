import { Layout } from "antd";
import Head from "next/head";
import { OGRequestInfoContent } from "../../components/organisms/content/request-info-content.organism";
import { OGHeader } from "../../components/organisms/header/header.organism";
import { isStudent, isTeacher } from "../../utils/role.util";

const { Content } = Layout;
export default function Home() {
  if (!isTeacher() && !isStudent()) return null;

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
        <OGRequestInfoContent />
      </Content>
    </>
  );
}

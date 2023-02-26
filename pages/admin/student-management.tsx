import { Layout } from "antd";
import Head from "next/head";
import { withAdminSideBar } from "../../components/molecules/sidebar-menu/admin-sidebar-menu.molecule";
import { OGHeader } from "../../components/organisms/header/header.organism";
import { OGTable } from "../../components/organisms/table/table.organism";
import { studentManagementListConfig } from "../../config/admin/student-management-list.config";

const { Content } = Layout;
export default function Home() {
  return (
    <>
      <Head>
        <title>Quản lý luận văn</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Content className="min-h-screen bg-gray-100">
        <>
          <OGHeader />
          <ContentWithAdminSideBar />
        </>
      </Content>
    </>
  );
}

const ContentWithAdminSideBar = withAdminSideBar(() => (
  <Content className="w-full mx-20 my-5">
    <OGTable config={studentManagementListConfig} />
  </Content>
));

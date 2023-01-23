import { Layout } from "antd";
import Head from "next/head";
import { MCProfileForm } from "../../components/molecules/form/profile-form.molecule";
import { OGHeader } from "../../components/organisms/header/header.organism";

export default function Home() {
  const { Content } = Layout;

  return (
    <>
      <Head>
        <title>Quản lý luận văn</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Content className="h-screen bg-gray-100">
        <OGHeader />
        <Content className="m-16 space-y-5">
          <span className="text-2xl font-semibold text-gray-800">
            Hồ Sơ Sinh Viên
          </span>
          <Content className="rounded-md shadow-md bg-white h-96">
            <MCProfileForm />
          </Content>
        </Content>
      </Content>
    </>
  );
}
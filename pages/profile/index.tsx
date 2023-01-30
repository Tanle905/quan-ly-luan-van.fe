import { Layout } from "antd";
import Head from "next/head";
import { MCProfileAvatarForm } from "../../components/molecules/form/profile-avatar-form.molecule";
import { MCProfileForm } from "../../components/molecules/form/profile-form.molecule";
import { OGHeader } from "../../components/organisms/header/header.organism";
import { isTeacher } from "../../utils/role.util";

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
      <Content className="h-screen overflow-auto bg-gray-100">
        <OGHeader />
        <Content className="mx-16 mt-2 space-y-2">
          <span className="text-2xl font-semibold text-gray-800">
            {isTeacher() ? "Hồ sơ giảng viên" : "Hồ Sơ Sinh Viên"}
          </span>
          <Content className="grid grid-cols-12 space-x-5">
            <Content className="col-span-3 flex flex-col items-center">
              <MCProfileAvatarForm />
            </Content>
            <Content className="col-span-9">
              <MCProfileForm />
            </Content>
          </Content>
        </Content>
      </Content>
    </>
  );
}

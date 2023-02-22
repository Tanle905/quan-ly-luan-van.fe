import { Layout } from "antd";
import Head from "next/head";
import { useRecoilValue } from "recoil";
import { OGThesisProgressContent } from "../../components/organisms/content/thesis-progress-content.organism";
import { OGHeader } from "../../components/organisms/header/header.organism";
import { Student } from "../../interfaces/student.interface";
import { Teacher } from "../../interfaces/teacher.interface";
import { userState } from "../../stores/auth.store";
import { isStudent, isTeacher } from "../../utils/role.util";

const { Content } = Layout;
export default function Home() {
  const user = useRecoilValue<(Student & Teacher) | null>(userState);

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
        <Content className="my-5">
          <OGThesisProgressContent />
        </Content>
      </Content>
    </>
  );
}

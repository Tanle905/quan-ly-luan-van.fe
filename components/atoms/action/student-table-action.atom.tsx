import { InfoCircleOutlined, MessageOutlined } from "@ant-design/icons";
import { Layout, Tooltip } from "antd";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { SCREEN_ROUTE } from "../../../constants/screen-route";
import { Student } from "../../../interfaces/student.interface";
import { userState } from "../../../stores/auth.store";

interface AtomStudentTableActionProps {
  student: Student;
}

export function AtomStudentTableAction({
  student,
}: AtomStudentTableActionProps) {
  const user = useRecoilValue<any>(userState);
  const router = useRouter();

  function handleThesisProgressRedirect() {
    router.push(`${SCREEN_ROUTE.THESIS_PROGRESS}/${student.MSSV}`);
  }

  if (!user) return null;

  return (
    <>
      <Layout.Content className="flex justify-end space-x-1">
        <Tooltip title="Gửi tin cho sinh viên">
          <MessageOutlined className="cursor-pointer p-2 hover:bg-indigo-600 hover:text-white rounded-md transition-all" />
        </Tooltip>
        <Tooltip title="Xem thông tin sinh viên">
          <InfoCircleOutlined
            onClick={handleThesisProgressRedirect}
            className="cursor-pointer p-2 hover:bg-indigo-600 hover:text-white rounded-md transition-all"
          />
        </Tooltip>
      </Layout.Content>
    </>
  );
}

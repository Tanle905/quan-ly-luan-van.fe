import {
  InfoCircleOutlined,
  MessageOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import {
  Dropdown,
  Layout,
  MenuItemProps,
  MenuProps,
  message,
  Tooltip,
  Typography,
} from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { baseURL, STUDENT_ENDPOINT } from "../../../constants/endpoints";
import { reloadTableSubject } from "../../../constants/observables";
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
        <MoreDropdown MSSV={student.MSSV} />
      </Layout.Content>
    </>
  );
}

function MoreDropdown({ MSSV }: { MSSV: string }) {
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Typography.Text onClick={handleRemoveStudent}>
          Xóa sinh viên
        </Typography.Text>
      ),
    },
  ];

  async function handleRemoveStudent() {
    try {
      await axios.delete(`${baseURL}${STUDENT_ENDPOINT.BASE}/${MSSV}`);

      message.success("Xóa sinh viên thành công.");
      reloadTableSubject.next(1);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <MoreOutlined className="cursor-pointer p-2 hover:bg-indigo-600 hover:text-white rounded-md transition-all" />
    </Dropdown>
  );
}

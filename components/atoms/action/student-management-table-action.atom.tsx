import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Layout, MenuProps, message, Typography } from "antd";
import axios from "axios";
import {
  baseURL,
  STUDENT_MANAGEMENT_ENDPOINT,
} from "../../../constants/endpoints";
import { reloadTableSubject } from "../../../constants/observables";
import { Student } from "../../../interfaces/student.interface";
import { MCAddUserFormModal as MCAddUserFormModal } from "../../molecules/modal/add-user-form-modal.molecule";
import { User } from "../../../interfaces/user.interface";

interface AtomStudentManagementTableActionProps {
  student: Student;
}

export function AtomStudentManagementTableAction({
  student,
}: AtomStudentManagementTableActionProps) {
  return (
    <>
      <Layout.Content className="flex justify-end space-x-1">
        <MoreDropdown student={student} />
      </Layout.Content>
    </>
  );
}

function MoreDropdown({ student }: { student: User }) {
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <MCAddUserFormModal
          title="Chỉnh sửa sinh viên"
          endpoint={STUDENT_MANAGEMENT_ENDPOINT.BASE}
          data={student}
          triggerElement={(open) => (
            <Typography.Text onClick={open}>
              Chỉnh sửa sinh viên
            </Typography.Text>
          )}
        />
      ),
    },
    {
      key: "2",
      label: (
        <Typography.Text onClick={handleRemoveStudent}>
          Xóa sinh viên
        </Typography.Text>
      ),
    },
  ];

  async function handleRemoveStudent() {
    try {
      await axios.delete(
        `${baseURL}${STUDENT_MANAGEMENT_ENDPOINT.BASE}/${student.MSSV}`
      );

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

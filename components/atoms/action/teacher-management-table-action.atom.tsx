import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Layout, MenuProps, message, Typography } from "antd";
import axios from "axios";
import {
  baseURL,
  TEACHER_MANAGEMENT_ENDPOINT,
} from "../../../constants/endpoints";
import { reloadTableSubject } from "../../../constants/observables";
import { MCAddUserFormModal as MCAddUserFormModal } from "../../molecules/modal/add-user-form-modal.molecule";
import { User } from "../../../interfaces/user.interface";
import { Teacher } from "../../../interfaces/teacher.interface";
import { Roles } from "../../../constants/enums";

interface AtomTeacherManagementTableActionProps {
  teacher: Teacher;
}

export function AtomTeacherManagementTableAction({
  teacher,
}: AtomTeacherManagementTableActionProps) {
  return (
    <>
      <Layout.Content className="flex justify-end space-x-1">
        <MoreDropdown teacher={teacher} />
      </Layout.Content>
    </>
  );
}

function MoreDropdown({ teacher }: { teacher: User }) {
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <MCAddUserFormModal
          title="Chỉnh sửa sinh viên"
          endpoint={TEACHER_MANAGEMENT_ENDPOINT.BASE}
          data={teacher}
          role={Roles.TEACHER}
          triggerElement={(open) => (
            <Typography.Text onClick={open}>
              Chỉnh sửa giảng viên
            </Typography.Text>
          )}
        />
      ),
    },
    {
      key: "2",
      label: (
        <Typography.Text onClick={handleRemoveTeacher}>
          Xóa giảng viên
        </Typography.Text>
      ),
    },
  ];

  async function handleRemoveTeacher() {
    try {
      await axios.delete(
        `${baseURL}${TEACHER_MANAGEMENT_ENDPOINT.BASE}/${teacher.MSCB}`
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

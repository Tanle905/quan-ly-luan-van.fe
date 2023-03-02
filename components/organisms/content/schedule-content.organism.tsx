import { UploadOutlined } from "@ant-design/icons";
import { Button, Layout, message, Typography } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import axios from "axios";
import { useState } from "react";
import {
  baseURL,
  COMMON_ENDPOINT,
  THESIS_DEFENSE_SCHEDULE_ENDPOINT,
} from "../../../constants/endpoints";
import { MCThesisDefenseScheduleCalendar } from "../../molecules/calendar/thesis-defense-schedule-calendar.molecule";
import { MCUploadModal } from "../../molecules/modal/upload-modal.molecule";

export function OGScheduleContent() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  function handleOpenModal() {
    setIsModalVisible(true);
  }

  function handleCloseModal() {
    setIsModalVisible(false);
  }

  async function handleUploadStudentList(files: UploadChangeParam) {
    const formData = new FormData();
    const { file } = files;
    const { name, status, originFileObj, type } = file;

    if (status === "done" && type?.slice(type.lastIndexOf("/") + 1) !== "csv")
      return message.error("Tệp không đúng định dạng.");

    if (status === "done") {
      try {
        formData.append("file", originFileObj as Blob);

        await axios.post(
          baseURL +
            THESIS_DEFENSE_SCHEDULE_ENDPOINT.BASE +
            THESIS_DEFENSE_SCHEDULE_ENDPOINT.STUDENT_LIST.BASE +
            COMMON_ENDPOINT.IMPORT,

          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        message.success("Tải lên thành công");
      } catch (error: any) {
        message.error("Tải lên thất bại!");
      }
    }
  }

  return (
    <Layout.Content className="space-y-3 my-5 mx-20">
      <MCUploadModal
        title="Tải lên danh sách sinh viên"
        onChange={handleUploadStudentList}
        open={isModalVisible}
        onCancel={handleCloseModal}
      />
      <Layout.Content className="flex justify-between">
        <Typography.Title level={3} style={{ marginBottom: 0 }} className="m-0">
          Lịch biểu bảo vệ luận văn
        </Typography.Title>
        <Button type="primary" onClick={handleOpenModal}>
          <UploadOutlined />
          Tải file lên
        </Button>
      </Layout.Content>
      <MCThesisDefenseScheduleCalendar />
    </Layout.Content>
  );
}

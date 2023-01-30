import {
  InfoCircleOutlined,
  MessageOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Layout, message, Tooltip } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { baseUrl, REQUEST_ENDPOINT } from "../../../constants/endpoints";
import { requestSendSubject } from "../../../constants/observables";
import { SCREEN_ROUTE } from "../../../constants/screen-route";
import { Student } from "../../../interfaces/student.interface";
import { Teacher } from "../../../interfaces/teacher.interface";
import { NotificationService } from "../../../services/notification.service";
import { userState } from "../../../stores/auth.store";

interface AtomStudentTableActionProps {
  student: Student;
}

export function AtomStudentTableAction({
  student,
}: AtomStudentTableActionProps) {
  const [user, setUser] = useRecoilState<Teacher>(userState);
  const router = useRouter();
  const [msg, contextHolder] = message.useMessage();

  function handleThesisProgressRedirect() {
    router.push(`${SCREEN_ROUTE.THESIS_PROGRESS}/${student.MSSV}`);
  }

  if (!user) return null;

  return (
    <>
      {contextHolder}
      <Layout.Content className="flex justify-end space-x-1">
        <Tooltip title="Gửi tin cho sinh viên">
          <MessageOutlined className="cursor-pointer p-2 hover:bg-indigo-600 hover:text-white rounded-md transition-all" />
        </Tooltip>
        <Tooltip title="Xem thông tin sinh viên">
          <InfoCircleOutlined onClick={handleThesisProgressRedirect} className="cursor-pointer p-2 hover:bg-indigo-600 hover:text-white rounded-md transition-all" />
        </Tooltip>
      </Layout.Content>
    </>
  );
}

import {
  InfoCircleOutlined,
  MessageOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Layout, message, Tooltip } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { REQUEST_ENDPOINT } from "../../../constants/endpoints";
import {
  reloadProfileSubject,
  reloadTableSubject,
} from "../../../constants/observables";
import { SCREEN_ROUTE } from "../../../constants/screen-route";
import { Student } from "../../../interfaces/student.interface";
import { Teacher } from "../../../interfaces/teacher.interface";
import { NotificationService } from "../../../services/notification.service";
import { userState } from "../../../stores/auth.store";

interface AtomTeacherTableActionProps {
  teacher: Teacher;
}

export function AtomTeacherTableAction({
  teacher,
}: AtomTeacherTableActionProps) {
  const user = useRecoilValue<Student | null>(userState);
  const [isLoading, setIsLoading] = useState(false);
  const isRequestSent = user?.sentRequestsList?.find(
    (request: any) => request === teacher._id
  );
  const router = useRouter();

  async function handleSendRequest() {
    if (isRequestSent || isLoading) return;
    setIsLoading(true);
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL +
          REQUEST_ENDPOINT.BASE +
          REQUEST_ENDPOINT.SEND,
        {
          MSSV: user?.MSSV,
          MSCB: teacher.MSCB,
        }
      );

      reloadProfileSubject.next(1);
      reloadTableSubject.next(1);
      message.success("Gửi yêu cầu thành công");

      await NotificationService.sendNotification({
        user,
        receiver: teacher._id,
        content: `Sinh viên ${user?.lastName} ${user?.firstName} (${user?.email}) - ${user?.MSSV} đã gửi yêu cầu xin hướng dẫn.`,
      });
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) return null;

  return (
    <>
      <Layout.Content className="flex justify-end space-x-1">
        <Tooltip title="Gửi tin cho giảng viên">
          <MessageOutlined className="cursor-pointer p-2 hover:bg-indigo-600 hover:text-white rounded-md transition-all" />
        </Tooltip>
        <Tooltip
          title={
            isRequestSent
              ? "Bạn đã gửi yêu cầu cho giảng viên này"
              : "Gửi yêu cầu cho giảng viên"
          }
        >
          <SendOutlined
            className={`p-2 rounded-md transition-all ${
              isRequestSent || isLoading
                ? "cursor-default text-gray-700 bg-gray-300"
                : "cursor-pointer hover:bg-indigo-600 hover:text-white"
            }`}
            onClick={handleSendRequest}
          />
        </Tooltip>
        <Tooltip title="Xem thông tin giảng viên">
          <InfoCircleOutlined
            onClick={() =>
              router.push(`${SCREEN_ROUTE.PROFILE}/${teacher._id}`)
            }
            className="cursor-pointer p-2 hover:bg-indigo-600 hover:text-white rounded-md transition-all"
          />
        </Tooltip>
      </Layout.Content>
    </>
  );
}

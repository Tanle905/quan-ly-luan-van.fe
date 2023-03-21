import {
  MessageOutlined,
  InfoCircleOutlined,
  CloseOutlined,
  CheckOutlined,
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
import { Request } from "../../../interfaces/request.interface";
import { Student } from "../../../interfaces/student.interface";
import { userState } from "../../../stores/auth.store";

interface AtomReceivedRequestTableActionProps {
  request: Request;
}

export function AtomReceivedRequestTableAction({
  request,
}: AtomReceivedRequestTableActionProps) {
  const user = useRecoilValue<Student | null>(userState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleAcceptRequest() {
    if (!user || request.isTeacherAccepted || isLoading) return null;

    setIsLoading(true);
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL +
          REQUEST_ENDPOINT.BASE +
          REQUEST_ENDPOINT.ACCEPT,
        {
          id: request._id,
          role: user.roles[0],
        }
      );

      reloadTableSubject.next(1);
      message.success("Chấp nhận yêu cầu thành công");
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteRequest() {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL +
          REQUEST_ENDPOINT.BASE +
          REQUEST_ENDPOINT.REJECT,
        {
          id: request._id,
          MSSV: request.student.MSSV,
        }
      );

      reloadProfileSubject.next(1);
      reloadTableSubject.next(1);
      message.success("Xóa yêu cầu thành công");
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Layout.Content className="flex justify-end space-x-1">
      <Tooltip
        title={
          request.isTeacherAccepted
            ? "Bạn đã chấp nhận yêu cầu"
            : "Chấp nhận yêu cầu"
        }
      >
        <CheckOutlined
          onClick={handleAcceptRequest}
          className={`p-2 rounded-md transition-all ${
            request.isTeacherAccepted
              ? "bg-gray-300 text-gray-800"
              : "text-green-600 hover:bg-indigo-600 hover:text-white"
          }`}
        />
      </Tooltip>
      <Tooltip title="Xóa yêu cầu">
        <CloseOutlined
          onClick={handleDeleteRequest}
          className="cursor-pointer p-2 text-red-600 hover:bg-indigo-600 hover:text-white rounded-md transition-all"
        />
      </Tooltip>
      <Tooltip title="Gửi tin cho sinh viên">
        <MessageOutlined className="cursor-pointer p-2 hover:bg-indigo-600 hover:text-white rounded-md transition-all" />
      </Tooltip>
      <Tooltip title="Thông tin sinh viên và đề tài" placement="topLeft">
        <InfoCircleOutlined
          onClick={() =>
            router.push(`${SCREEN_ROUTE.REQUEST_INFO}/${request._id}`)
          }
          className="cursor-pointer p-2 hover:bg-indigo-600 hover:text-white rounded-md transition-all"
        />
      </Tooltip>
    </Layout.Content>
  );
}

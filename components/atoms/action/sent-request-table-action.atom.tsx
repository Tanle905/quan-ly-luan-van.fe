import {
  MessageOutlined,
  InfoCircleOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { Layout, message, Modal, Tooltip } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { REQUEST_ENDPOINT } from "../../../constants/endpoints";
import { TopicStatus } from "../../../constants/enums";
import {
  reloadProfileSubject,
  reloadTableSubject,
} from "../../../constants/observables";
import { SCREEN_ROUTE } from "../../../constants/screen-route";
import { Request } from "../../../interfaces/request.interface";
import { Student } from "../../../interfaces/student.interface";
import { userState } from "../../../stores/auth.store";

interface AtomSentRequestTableActionProps {
  request: Request;
}

export function AtomSentRequestTableAction({
  request,
}: AtomSentRequestTableActionProps) {
  const user = useRecoilValue<Student | null>(userState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleAcceptRequest() {
    if (
      !user ||
      request.isStudentAccepted ||
      request.topic?.topicStatus !== TopicStatus.Accepted ||
      isLoading
    )
      return null;

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
      reloadProfileSubject.next(1);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      message.success("Chấp nhận yêu cầu thành công");
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteRequest() {
    if (!user?.MSSV || isLoading) return;

    setIsLoading(true);
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL +
          REQUEST_ENDPOINT.BASE +
          REQUEST_ENDPOINT.REJECT,
        {
          id: request._id,
          MSSV: user.MSSV,
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
          request.topic?.topicStatus !== TopicStatus.Accepted
            ? "Đề tài chưa được duyệt"
            : request.isStudentAccepted
            ? "Bạn đã chấp nhận yêu cầu"
            : "Chấp nhận yêu cầu"
        }
      >
        <CheckOutlined
          onClick={() =>
            !(
              request.isStudentAccepted ||
              request.topic?.topicStatus !== TopicStatus.Accepted
            ) &&
            Modal.confirm({
              closable: true,
              onOk: handleAcceptRequest,
              title: "Chấp nhận yêu cầu",
              content: "Bạn có muốn chấp nhận yêu cầu ?",
            })
          }
          className={`p-2 rounded-md transition-all ${
            request.isStudentAccepted ||
            request.topic?.topicStatus !== TopicStatus.Accepted
              ? "bg-gray-300 text-gray-800"
              : "text-green-600 hover:bg-indigo-600 hover:text-white"
          }`}
        />
      </Tooltip>
      <Tooltip title="Xóa yêu cầu">
        <CloseOutlined
          onClick={() =>
            Modal.confirm({
              closable: true,
              onOk: handleDeleteRequest,
              title: "Hủy yêu cầu",
              content: "Bạn có muốn hủy yêu cầu ?",
            })
          }
          className="cursor-pointer p-2 text-red-600 hover:bg-indigo-600 hover:text-white rounded-md transition-all"
        />
      </Tooltip>
      <Tooltip title="Thông tin giảng viên và đề tài" placement="topLeft">
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

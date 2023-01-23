import {
  InfoCircleOutlined,
  MessageOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Layout, message, Tooltip } from "antd";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { Observable } from "rxjs";
import {
  baseUrl,
  NOTIFICATION_ENDPOINT,
  REQUEST_ENDPOINT,
} from "../../../constants/endpoints";
import { LOCAL_STORAGE } from "../../../constants/local_storage_key";
import { requestSendSubject } from "../../../constants/observables";
import { Notification } from "../../../interfaces/notification.interface";
import { Student } from "../../../interfaces/student.interface";
import { Teacher } from "../../../interfaces/teacher.interface";
import { userState } from "../../../stores/auth.store";

interface AtomTeacherTableActionProps {
  teacher: Teacher;
}

export function AtomTeacherTableAction({
  teacher,
}: AtomTeacherTableActionProps) {
  const [user, setUser] = useRecoilState<Student>(userState);
  const isRequestSent = user?.sentRequestList?.find(
    (request) => request.MSCB === teacher.MSCB
  );
  const [msg, contextHolder] = message.useMessage();

  async function handleSendRequest() {
    try {
      const res = await axios.post(
        baseUrl + REQUEST_ENDPOINT.BASE,
        {
          MSSV: user?.MSSV,
          MSCB: teacher.MSCB,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );

      setUser((prevUser: any) => {
        localStorage.setItem(
          LOCAL_STORAGE.USER_DATA,
          JSON.stringify({
            ...prevUser,
            sentRequestList: res.data.studentData.sentRequestList,
          })
        );
        return {
          ...prevUser,
          sentRequestList: res.data.studentData.sentRequestList,
        };
      });
      requestSendSubject.next(1);
      message.success("Gửi yêu cầu thành công");

      const notificationBody: Notification = {
        sender: user._id,
        receiver: teacher._id,
        content: `Sinh viên ${user.name}(${user.email})-${user.MSSV} đã gửi yêu cầu xin hướng dẫn.`,
      };

      await axios.post(baseUrl + NOTIFICATION_ENDPOINT.BASE, notificationBody, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
    } catch (error: any) {
      message.error(error.message);
    }
  }

  if (!user) return null;

  return (
    <>
      {contextHolder}
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
              isRequestSent
                ? "cursor-default text-gray-700 bg-gray-300"
                : "cursor-pointer hover:bg-indigo-600 hover:text-white"
            }`}
            onClick={() => !isRequestSent && handleSendRequest()}
          />
        </Tooltip>
        <Tooltip title="Xem thông tin giảng viên">
          <InfoCircleOutlined className="cursor-pointer p-2 hover:bg-indigo-600 hover:text-white rounded-md transition-all" />
        </Tooltip>
      </Layout.Content>
    </>
  );
}

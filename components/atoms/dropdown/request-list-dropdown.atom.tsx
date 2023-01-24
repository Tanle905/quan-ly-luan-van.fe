import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Divider, Dropdown, Layout, MenuProps, message } from "antd";
import axios from "axios";
import moment from "moment";
import { ReactElement, ReactNode, useState } from "react";
import { useRecoilState } from "recoil";
import { baseUrl, REQUEST_ENDPOINT } from "../../../constants/endpoints";
import { LOCAL_STORAGE } from "../../../constants/local_storage_key";
import { requestSendSubject } from "../../../constants/observables";
import { Request } from "../../../interfaces/request.interface";
import { Student } from "../../../interfaces/student.interface";
import { Teacher } from "../../../interfaces/teacher.interface";
import { NotificationService } from "../../../services/notification.service";
import { userState } from "../../../stores/auth.store";
import { isTeacher } from "../../../utils/role.util";

interface AtomRequestListDropdownProps {
  children: ReactElement | ReactNode;
}

export function AtomRequestListDropdown({
  children,
}: AtomRequestListDropdownProps) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useRecoilState<(Student & Teacher) | null>(userState);
  const listName = isTeacher() ? "receivedRequestList" : "sentRequestList";
  const currentUserName = isTeacher() ? "teacherData" : "studentData";
  const requestListMenuItems: MenuProps["items"] =
    user && Array.isArray(user[listName]) && user[listName].length > 0
      ? user?.[listName]?.map((request: Request, index: number) => {
          const time = moment(request.createdAt).format("LT");
          const date = moment(request.createdAt).format("LL");

          return {
            key: index,
            label: (
              <Layout.Content className=" flex justify-between space-x-4 px-1 items-center cursor-default">
                <Layout.Content className="flex flex-col">
                  <Layout.Content className="flex items-center space-x-2">
                    <span className="font-semibold">
                      {isTeacher() ? request.studentName : request.teacherName}
                    </span>
                    <Divider type="vertical" className="border-gray-400" />
                    <span className="font-semibold">
                      {isTeacher() ? request.MSSV : request.MSCB}
                    </span>
                  </Layout.Content>
                  <span>
                    {isTeacher() ? request.studentEmail : request.teacherEmail}
                  </span>
                  <Layout.Content>
                    <span className="text-xs text-gray-500">{time}</span>
                    <Divider type="vertical" className="border-gray-400" />
                    <span className="text-xs text-gray-500">{date}</span>
                  </Layout.Content>
                </Layout.Content>
                <Layout.Content className="space-x-1">
                  {isTeacher() && (
                    <CheckOutlined
                      className="text-green-600 hover:bg-gray-200 p-2 rounded-md transition-all"
                      onClick={() => handleAcceptRequest(request)}
                    />
                  )}
                  <CloseOutlined
                    onClick={() => handleDeleteRequest(request)}
                    className="text-red-600 hover:bg-gray-200 p-2 rounded-md transition-all"
                  />
                </Layout.Content>
              </Layout.Content>
            ),
          };
        })
      : [
          {
            key: "1",
            disabled: true,
            label: (
              <Layout.Content className="flex justify-between w-72 h-32 space-x-4 items-center cursor-default">
                <span className="text-gray-500 m-auto">
                  Danh sách yêu cầu trống
                </span>
              </Layout.Content>
            ),
          },
        ];

  async function handleAcceptRequest(request: Request) {
    try {
      const res = await axios.post(
        baseUrl + REQUEST_ENDPOINT.BASE + REQUEST_ENDPOINT.ACCEPT,
        {
          id: request._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );

      setUser((prevUser: any) => {
        const updatedData = {
          [listName]: res.data[currentUserName][listName],
          studentList: res.data[currentUserName].studentList,
        };

        return {
          ...prevUser,
          ...updatedData,
        };
      });
      await NotificationService.sendNotification({
        user,
        receiver: request.studentId,
        content: `${
          isTeacher() ? request.teacherName : request.studentName
        } đã chấp nhận yêu cầu của bạn.`,
      });
      requestSendSubject.next(1);
      message.success("Chấp nhận yêu cầu thành công");
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  async function handleDeleteRequest(request: Request) {
    try {
      const res = await axios.post(
        baseUrl + REQUEST_ENDPOINT.BASE + REQUEST_ENDPOINT.REJECT,
        {
          id: request._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );

      setUser((prevUser: any) => {
        return {
          ...prevUser,
          [listName]: res.data[currentUserName][listName],
        };
      });
      await NotificationService.sendNotification({
        user,
        receiver: isTeacher() ? request.studentId : request.teacherId,
        content: `${
          isTeacher() ? request.teacherName : request.studentName
        } đã hủy yêu cầu.`,
      });
      requestSendSubject.next(1);
      message.success("Xóa yêu cầu thành công");
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }
  return (
    <Dropdown
      menu={{
        items: requestListMenuItems,
        className: "max-h-96 overflow-auto",
      }}
      open={open}
      onOpenChange={() => setOpen(!open)}
      trigger={["click"]}
      placement="bottomRight"
    >
      {children}
    </Dropdown>
  );
}

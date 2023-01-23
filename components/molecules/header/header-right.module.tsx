import {
  BellOutlined,
  CloseOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Dropdown, Layout, MenuProps, message, Tooltip } from "antd";
import axios from "axios";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { baseUrl, REQUEST_ENDPOINT } from "../../../constants/endpoints";
import { LOCAL_STORAGE } from "../../../constants/local_storage_key";
import { requestSendSubject } from "../../../constants/observables";
import { Student } from "../../../interfaces/student.interface";
import { userState } from "../../../stores/auth.store";
import { AtomIconHeader } from "../../atoms/icon/icon-header.atom";
import { AtomImageAvatar } from "../../atoms/image/image-avatar.atom";

interface MCHeaderRightProps {
  styles?: React.CSSProperties;
}

export function MCHeaderRight({ styles }: MCHeaderRightProps) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useRecoilState<Student | null>(userState);
  const requestListMenuItems: MenuProps["items"] = user?.sentRequestList?.length > 0 ? user?.sentRequestList?.map(
    (request, index) => {
      return {
        key: index,
        label: (
          <Layout.Content className=" flex justify-between space-x-4 items-center cursor-default">
            <Layout.Content className="flex flex-col">
              <span>{request.name}</span>
              <span>{request.email}</span>
            </Layout.Content>
            <CloseOutlined
              onClick={() => handleDeleteRequest(user.MSSV, request.MSCB)}
              className="text-red-600 hover:bg-indigo-500 p-2 rounded-md transition-all"
            />
          </Layout.Content>
        ),
      };
    }
  ) :  [{
    key: '1',
    disabled: true,
    label: (
      <Layout.Content className="flex justify-between h-32 space-x-4 items-center cursor-default">
          <span className="text-gray-500">Danh sách yêu cầu trống</span>
      </Layout.Content>
    ),
  }];

  async function handleDeleteRequest(MSSV: string, MSCB: string) {
    try {
      const res = await axios.put(
        baseUrl + REQUEST_ENDPOINT.BASE,
        {
          MSSV,
          MSCB,
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
      message.success("Xóa yêu cầu thành công");
    } catch (error: any) {
      message.error(error.message);
    }
  }

  return (
    <Layout.Content className="flex space-x-4 py-2 items-center" style={styles}>
      <AtomIconHeader icon={<SearchOutlined />} />
      <AtomIconHeader icon={<BellOutlined />} />
      <AtomIconHeader
        icon={
            <Dropdown
              menu={{ items: requestListMenuItems }}
              open={open}
              onOpenChange={() => setOpen(!open)}
              trigger={["click"]}
            >
              <UnorderedListOutlined />
            </Dropdown>
        }
      />
      <AtomImageAvatar />
    </Layout.Content>
  );
}

import { Dropdown, Layout, MenuItemProps, MenuProps } from "antd";
import axios, { AxiosError } from "axios";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import useSWR from "swr";
import { baseUrl, NOTIFICATION_ENDPOINT } from "../../../constants/endpoints";
import { Notification } from "../../../interfaces/notification.interface";
import { Student } from "../../../interfaces/student.interface";
import { Teacher } from "../../../interfaces/teacher.interface";
import { userState } from "../../../stores/auth.store";

interface AtomNotificationListDropDownProps {
  children: ReactElement | ReactNode;
}

export function AtomNotificationListDropDown({
  children,
}: AtomNotificationListDropDownProps) {
  const user = useRecoilValue<Student | Teacher | null>(userState);
  const { data } = useSWR<Notification[] | null>(
    user && baseUrl + NOTIFICATION_ENDPOINT.BASE,
    notificationFetcher
  );
  const [menuItems, setMenuItems] = useState<MenuProps["items"]>([
    {
      key: "1",
      disabled: true,
      label: (
        <Layout.Content className="flex justify-between h-32 space-x-4 items-center cursor-default">
          <span className="text-gray-500">Không có thông báo nào</span>
        </Layout.Content>
      ),
    },
  ]);

  useEffect(() => {
    data &&
      data.length > 0 &&
      setMenuItems(
        data.map((notification, index) => {
          return {
            key: index,
            label: (
              <Layout.Content className="w-56">
                <span>{notification.content}</span>
              </Layout.Content>
            ),
          };
        })
      );
  }, [data]);

  async function notificationFetcher() {
    try {
      const { data } = await axios.get(baseUrl + NOTIFICATION_ENDPOINT.BASE, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });

      return data;
    } catch (error: any) {
      console.log(error.response);
    }
  }

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={["click"]}
      placement="bottom"
    >
      {children}
    </Dropdown>
  );
}

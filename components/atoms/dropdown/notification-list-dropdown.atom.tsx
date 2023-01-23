import { Divider, Dropdown, Layout, MenuItemProps, MenuProps } from "antd";
import axios, { AxiosError } from "axios";
import moment from "moment";
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
  const [open, setOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuProps["items"]>([
    {
      key: "1",
      disabled: true,
      label: (
        <Layout.Content className="flex justify-between w-96 h-32 space-x-4 items-center cursor-default">
          <span className="text-gray-500 m-auto">Không có thông báo nào</span>
        </Layout.Content>
      ),
    },
  ]);

  useEffect(() => {
    data &&
      data.length > 0 &&
      setMenuItems(
        data.map((notification, index) => {
          const time = moment(notification.createdAt).format("LT");
          const date = moment(notification.createdAt).format("LL");
          return {
            key: index,
            className: "cursor-default hover:bg-indigo-600 transition-all",
            label: (
              <Layout.Content className="w-96 relative">
                {!notification.is_read && (
                  <div className="absolute top-0 right-0 bg-indigo-600 h-2 w-2 rounded-full"></div>
                )}
                <div className="w-5/6">
                  <span className="text-gray-600">{notification.content}</span>
                  <Layout.Content>
                    <span className="text-xs text-gray-500">{time}</span>
                    <Divider type="vertical" className="border-gray-400" />
                    <span className="text-xs text-gray-500">{date}</span>
                  </Layout.Content>
                </div>
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
      menu={{ items: menuItems, className: "max-h-96 overflow-auto" }}
      trigger={["click"]}
      placement="bottomRight"
      open={open}
      onOpenChange={() => setOpen(!open)}
    >
      {children}
    </Dropdown>
  );
}

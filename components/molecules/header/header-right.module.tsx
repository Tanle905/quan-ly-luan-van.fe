import { BellOutlined } from "@ant-design/icons";
import { Badge, Layout } from "antd";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Student } from "../../../interfaces/student.interface";
import { Teacher } from "../../../interfaces/teacher.interface";
import { userState } from "../../../stores/auth.store";
import { isAdmin } from "../../../utils/role.util";
import { AtomNotificationListDropDown } from "../../atoms/dropdown/notification-list-dropdown.atom";
import { AtomIconHeader } from "../../atoms/icon/icon-header.atom";
import { AtomImageAvatar } from "../../atoms/image/image-avatar.atom";

interface MCHeaderRightProps {
  styles?: React.CSSProperties;
}

export function MCHeaderRight({ styles }: MCHeaderRightProps) {
  const user = useRecoilValue<(Student & Teacher) | null>(userState);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!user || isAdmin()) return;
    setNotificationCount(user.notificationCount);
  }, [user]);

  return (
    <Layout.Content
      className="flex justify-end space-x-4 py-2 items-center"
      style={styles}
    >
      <AtomIconHeader
        icon={
          <AtomNotificationListDropDown>
            <Layout.Content className="relative">
              <BellOutlined />
              <Badge
                className="origin-left translate-x-4 absolute -top-[0.5rem] right-[0.15rem]"
                count={notificationCount}
                showZero
                size="small"
              />
            </Layout.Content>
          </AtomNotificationListDropDown>
        }
      />
      <AtomImageAvatar />
    </Layout.Content>
  );
}

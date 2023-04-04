import { BellOutlined } from "@ant-design/icons";
import { Badge, Layout } from "antd";
import { AtomNotificationListDropDown } from "../../atoms/dropdown/notification-list-dropdown.atom";
import { AtomIconHeader } from "../../atoms/icon/icon-header.atom";
import { AtomImageAvatar } from "../../atoms/image/image-avatar.atom";

interface MCHeaderRightProps {
  styles?: React.CSSProperties;
}

export function MCHeaderRight({ styles }: MCHeaderRightProps) {
  return (
    <Layout.Content
      className="flex justify-end space-x-4 py-2 items-center"
      style={styles}
    >
      <AtomIconHeader
        icon={
          <AtomNotificationListDropDown>
            {(data) => (
              <Layout.Content className="relative">
                <BellOutlined />
                <Badge
                  className="origin-left translate-x-4 absolute -top-[0.5rem] right-[0.15rem]"
                  count={data?.length}
                  showZero
                  size="small"
                />
              </Layout.Content>
            )}
          </AtomNotificationListDropDown>
        }
      />
      <AtomImageAvatar />
    </Layout.Content>
  );
}

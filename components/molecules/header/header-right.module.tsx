import {
  BellOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Layout } from "antd";
import { AtomIconHeader } from "../../atoms/icon/icon-header.atom";
import { AtomImageAvatar } from "../../atoms/image/image-avatar.atom";

interface MCHeaderRightProps {
  styles?: React.CSSProperties;
}

export function MCHeaderRight({ styles }: MCHeaderRightProps) {
  return (
    <Layout.Content className="flex space-x-4 py-2" style={styles}>
      <AtomIconHeader icon={<SearchOutlined />} />
      <AtomIconHeader icon={<SettingOutlined />} />
      <AtomIconHeader icon={<BellOutlined />} />
      <AtomImageAvatar />
    </Layout.Content>
  );
}

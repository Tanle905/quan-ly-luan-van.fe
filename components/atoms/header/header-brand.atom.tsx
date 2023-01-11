import { BookOutlined } from "@ant-design/icons";
import { Layout, Typography } from "antd";

export function AtomHeaderBrand(props: any) {
  const { Content } = Layout;

  return (
    <Content className="flex">
      <BookOutlined className="text-3xl mr-2" />
      <Typography.Title style={{ margin: 0 }} level={4}>
        Quản lý luận văn
      </Typography.Title>
    </Content>
  );
}

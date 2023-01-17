import { BookOutlined } from "@ant-design/icons";
import { Layout, Typography } from "antd";

export function AtomHeaderBrand(props: any) {
  const { Content } = Layout;

  return (
    <Content className="flex text-center">
      <BookOutlined className="text-3xl mr-2" />
      <span className="inline-block text-xl font-semibold my-2">Quản lý luận văn.</span>
    </Content>
  );
}

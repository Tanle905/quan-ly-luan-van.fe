import { BookOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import { useRouter } from "next/router";

export function AtomHeaderBrand(props: any) {
  const { Content } = Layout;
  const router = useRouter();

  return (
    <Content
      className="flex text-center cursor-pointer"
      onClick={() => router.push(props.href)}
    >
      <BookOutlined className="text-3xl mr-2" />
      <span className="inline-block text-xl font-semibold my-2">
        Quản lý luận văn.
      </span>
    </Content>
  );
}

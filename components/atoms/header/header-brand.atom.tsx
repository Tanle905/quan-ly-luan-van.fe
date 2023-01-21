import { BookOutlined } from "@ant-design/icons";
import { Layout, Typography } from "antd";
import { useRouter } from "next/router";
import { SCREEN_ROUTE } from "../../../constants/screen-route";

export function AtomHeaderBrand(props: any) {
  const { Content } = Layout;
  const router = useRouter();

  return (
    <Content
      className="flex text-center cursor-pointer"
      onClick={() => router.push(SCREEN_ROUTE.BASE)}
    >
      <BookOutlined className="text-3xl mr-2" />
      <span className="inline-block text-xl font-semibold my-2">
        Quản lý luận văn.
      </span>
    </Content>
  );
}

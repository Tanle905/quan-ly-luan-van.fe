import { BookOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { SCREEN_ROUTE } from "../../../constants/screen-route";
import { Student } from "../../../interfaces/student.interface";
import { Teacher } from "../../../interfaces/teacher.interface";
import { userState } from "../../../stores/auth.store";

export function AtomHeaderBrand(props: any) {
  const user = useRecoilValue<(Student & Teacher) | null>(userState);
  const { Content } = Layout;
  const router = useRouter();

  return (
    <Content
      className="flex text-center cursor-pointer"
      onClick={() =>
        router.push(
          user?.teacher ? SCREEN_ROUTE.THESIS_PROGRESS : SCREEN_ROUTE.BASE
        )
      }
    >
      <BookOutlined className="text-3xl mr-2" />
      <span className="inline-block text-xl font-semibold my-2">
        Quản lý luận văn.
      </span>
    </Content>
  );
}

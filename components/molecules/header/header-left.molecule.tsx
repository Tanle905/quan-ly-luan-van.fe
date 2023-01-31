import { Layout } from "antd";
import { useRecoilValue } from "recoil";
import { SCREEN_ROUTE } from "../../../constants/screen-route";
import { Student } from "../../../interfaces/student.interface";
import { Teacher } from "../../../interfaces/teacher.interface";
import { userState } from "../../../stores/auth.store";
import { AtomHeaderBrand } from "../../atoms/header/header-brand.atom";
import { AtomHeaderNavLink } from "../../atoms/header/header-nav-link.tom";

interface MCHeaderLeftProps {
  styles?: React.CSSProperties;
}

export function MCHeaderLeft({ styles }: MCHeaderLeftProps) {
  const user = useRecoilValue<(Student & Teacher) | null>(userState);

  return (
    <Layout.Content className="flex space-x-3 self-center" style={styles}>
      <AtomHeaderBrand />
      <AtomHeaderNavLink
        title="Trang Chủ"
        href={user?.teacher ? SCREEN_ROUTE.THESIS_PROGRESS : SCREEN_ROUTE.BASE}
      />
      <AtomHeaderNavLink title="Lịch Biểu" href={SCREEN_ROUTE.SCHEDULE} />
    </Layout.Content>
  );
}

import { Layout } from "antd";
import { useRecoilValue } from "recoil";
import { Roles } from "../../../constants/enums";
import { SCREEN_ROUTE } from "../../../constants/screen-route";
import { useMount } from "../../../hooks/use-mount";
import { Student } from "../../../interfaces/student.interface";
import { Teacher } from "../../../interfaces/teacher.interface";
import { userState } from "../../../stores/auth.store";
import { isAdmin } from "../../../utils/role.util";
import { AtomHeaderBrand } from "../../atoms/header/header-brand.atom";
import { AtomHeaderNavLink } from "../../atoms/header/header-nav-link.tom";

interface MCHeaderLeftProps {
  styles?: React.CSSProperties;
}

export function MCHeaderLeft({ styles }: MCHeaderLeftProps) {
  const user = useRecoilValue<(Student & Teacher) | null>(userState);
  const isMounted = useMount();
  let homeRoute = "/";

  switch (user?.roles[0]) {
    case Roles.TEACHER:
      homeRoute = SCREEN_ROUTE.BASE;
      break;
    case Roles.STUDENT:
      homeRoute = user.teacher
        ? SCREEN_ROUTE.THESIS_PROGRESS
        : SCREEN_ROUTE.BASE;
      break;
    case Roles.ADMIN:
      homeRoute =
        SCREEN_ROUTE.ADMIN.BASE + SCREEN_ROUTE.ADMIN.MANAGEMENT.SCHEDULE;
      break;
    default:
      break;
  }

  return (
    <Layout.Content className="flex space-x-3 self-center" style={styles}>
      <AtomHeaderBrand href={homeRoute} />
      <AtomHeaderNavLink title="Trang Chủ" href={homeRoute} />
      {isMounted && !isAdmin() && (
        <AtomHeaderNavLink title="Lịch Biểu" href={SCREEN_ROUTE.SCHEDULE} />
      )}
    </Layout.Content>
  );
}

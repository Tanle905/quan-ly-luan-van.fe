import { Layout } from "antd";
import { AtomHeaderBrand } from "../../atoms/header/header-brand.atom";
import { AtomHeaderNavLink } from "../../atoms/header/header-nav-link.tom";

interface MCHeaderLeftProps {
  styles?: React.CSSProperties;
}

export function MCHeaderLeft({ styles }: MCHeaderLeftProps) {
  return (
    <Layout.Content className="flex space-x-3 self-center" style={styles}>
      <AtomHeaderBrand />
      <AtomHeaderNavLink title="Trang Chủ" href="/" />
      <AtomHeaderNavLink title="Danh Sách" href="/list" />
    </Layout.Content>
  );
}

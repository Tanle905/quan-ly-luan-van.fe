import { Layout } from "antd";
import { withAdminSideBar } from "../../molecules/sidebar-menu/admin-sidebar-menu.molecule";

export function OGAdminContent() {
  return <Layout.Content></Layout.Content>;
}

export const OGAdminContentWithAdminSizeBar = withAdminSideBar(OGAdminContent);

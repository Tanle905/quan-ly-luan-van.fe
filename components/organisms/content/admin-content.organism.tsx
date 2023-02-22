import { Layout } from "antd";
import { MCAdminSidebarMenu } from "../../molecules/sidebar-menu/admin-sidebar-menu.molecule";

export function OGAdminContent(){
    return <Layout.Content>
        <MCAdminSidebarMenu />
    </Layout.Content>
}
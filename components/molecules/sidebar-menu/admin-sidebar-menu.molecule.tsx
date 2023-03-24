import React, { useState } from "react";
import {
  BookOutlined,
  CalendarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, MenuProps } from "antd";
import { Menu } from "antd";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { SCREEN_ROUTE } from "../../../constants/screen-route";
import { useRouter } from "next/router";

type MenuItem = Required<MenuProps>["items"][number];

function items(collapsed: boolean, toggleCollapsed: () => void): MenuItem[] {
  return [
    {
      key: "",
      label: collapsed ? "Mở rộng" : "Thu nhỏ thanh menu",
      onTitleClick: toggleCollapsed,
      className: "hover:bg-white",
      dashed: true,
      icon: collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />,
      expandIcon: <></>,
      children: [],
    },
    {
      label: "Lịch biểu",
      key: SCREEN_ROUTE.ADMIN.SCHEDULE,
      icon: <CalendarOutlined />,
    },
    {
      label: "Quản lý tài nguyên",
      key: "sub1",
      icon: <BookOutlined />,
      children: [
        {
          label: "Sinh viên",
          key: SCREEN_ROUTE.ADMIN.MANAGEMENT.STUDENT,
          icon: <UserOutlined />,
        },
        {
          label: "Giảng viên",
          key: SCREEN_ROUTE.ADMIN.MANAGEMENT.TEACHER,
          icon: <UserOutlined />,
        },
        {
          label: "Đề tài",
          key: SCREEN_ROUTE.ADMIN.MANAGEMENT.TOPIC,
          icon: <ArchiveBoxIcon className="w-4" />,
        },
      ],
    },
  ];
}

export function MCAdminSidebarMenu() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const currentSelectedKey = router.asPath.slice(
    router.asPath.lastIndexOf("/")
  );

  function handleSelectMenuItem({ key }: any) {
    router.push(SCREEN_ROUTE.ADMIN.BASE + key);
  }

  function toggleCollapsed() {
    setCollapsed(!collapsed);
  }

  return (
    <div style={{ width: collapsed ? 90 : 260 }} className="transition-all">
      <Menu
        className="h-screen"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        items={items(collapsed, toggleCollapsed)}
        onSelect={handleSelectMenuItem}
        selectedKeys={[currentSelectedKey]}
      />
    </div>
  );
}

export function withAdminSideBar<Type>(Component: any) {
  return (props: Type) => {
    return (
      <Layout.Content className="flex">
        <MCAdminSidebarMenu />
        <Component {...props} />
      </Layout.Content>
    );
  };
}

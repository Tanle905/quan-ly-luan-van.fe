import React, { useState } from "react";
import {
  BookOutlined,
  CalendarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";

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
    { label: "Lịch biểu", key: "schedule", icon: <CalendarOutlined /> },
    {
      label: "Quản lý tài nguyên",
      key: "sub1",
      icon: <BookOutlined />,
      children: [
        { label: "Sinh viên", key: "student-manager", icon: <UserOutlined /> },
        { label: "Giảng viên", key: "teacher-manager", icon: <UserOutlined /> },
        {
          label: "Đề tài",
          key: "thesis-manager",
          icon: <ArchiveBoxIcon className="w-4" />,
        },
      ],
    },
  ];
}

export function MCAdminSidebarMenu() {
  const [collapsed, setCollapsed] = useState(false);

  function handleSelectMenuItem({ key }: any) {
    console.log(key);
  }

  function toggleCollapsed() {
    setCollapsed(!collapsed);
  }

  return (
    <div style={{ width: 256 }}>
      <Menu
        className="h-screen"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        items={items(collapsed, toggleCollapsed)}
        onSelect={handleSelectMenuItem}
      />
    </div>
  );
}

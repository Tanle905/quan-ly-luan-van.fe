import {
  BellOutlined,
  CloseOutlined,
  SearchOutlined,
  SettingOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Dropdown, Layout, MenuProps, Tooltip } from "antd";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { Student } from "../../../interfaces/student.interface";
import { userState } from "../../../stores/auth.store";
import { AtomIconHeader } from "../../atoms/icon/icon-header.atom";
import { AtomImageAvatar } from "../../atoms/image/image-avatar.atom";

interface MCHeaderRightProps {
  styles?: React.CSSProperties;
}

export function MCHeaderRight({ styles }: MCHeaderRightProps) {
  const [open, setOpen] = useState(false);
  const user = useRecoilValue<Student | null>(userState);
  const requestListMenuItems: MenuProps['items'] = user?.sentRequestList?.map(
    (request) => {
      return {
        key: request,
        label: (
          <Layout.Content className="w-40 flex justify-between items-center px-1 cursor-default">
            <span>{request}</span>
            <CloseOutlined className="text-red-600 hover:bg-indigo-500 p-2 rounded-md transition-all" />
          </Layout.Content>
        ),
      };
    }
  );

  return (
    <Layout.Content className="flex space-x-4 py-2 items-center" style={styles}>
      <AtomIconHeader icon={<SearchOutlined />} />
      <AtomIconHeader icon={<BellOutlined />} />
      <AtomIconHeader
        icon={
          <Tooltip title="Danh sách yêu cầu đã gửi">
            <Dropdown
            menu={{ items: requestListMenuItems }}
            open={open}
            onOpenChange={() => setOpen(!open)}
            trigger={["click"]}
          >
            <UnorderedListOutlined />
          </Dropdown>
          </Tooltip>
        }
      />
      <AtomImageAvatar />
    </Layout.Content>
  );
}

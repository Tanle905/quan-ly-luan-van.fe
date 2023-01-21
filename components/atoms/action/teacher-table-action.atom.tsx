import { InfoCircleOutlined, SendOutlined } from "@ant-design/icons";
import { Layout, Tooltip } from "antd";

interface AtomTeacherTableActionProps {}

export function AtomTeacherTableAction({}: AtomTeacherTableActionProps) {
  return (
    <Layout.Content className="flex justify-end space-x-1">
      <Tooltip title="Gửi yêu cầu cho giảng viên">
        <SendOutlined className="cursor-pointer p-2 hover:bg-indigo-600 hover:text-white rounded-md transition-all" />
      </Tooltip>
      <Tooltip title="Xem thông tin giảng viên">
        <InfoCircleOutlined className="cursor-pointer p-2 hover:bg-indigo-600 hover:text-white rounded-md transition-all" />
      </Tooltip>
    </Layout.Content>
  );
}

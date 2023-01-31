import { Layout, Tabs, TabsProps, Typography } from "antd";
import { useRecoilValue } from "recoil";
import { Student } from "../../../interfaces/student.interface";
import { userState } from "../../../stores/auth.store";
import { MCThesisProgressCalendar } from "../../molecules/calendar/thesis-progress-calendar.molecule";

interface OGThesisProgressContentProps {
  MSSV?: string;
}

export function OGThesisProgressContent({
  MSSV,
}: OGThesisProgressContentProps) {
  const user = useRecoilValue<Student | null>(userState);
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Chủ đề luận văn`,
      children: `Content of Tab Pane 1`,
    },
    {
      key: "2",
      label: `Tiến trình luận văn`,
      children: <MCThesisProgressCalendar MSSV={MSSV} />,
      disabled: !user?.topic,
    },
  ];

  return (
    <Layout.Content className="space-y-3 px-5">
      <Typography.Title level={3} style={{ marginBottom: 0 }} className="m-0">
        Báo cáo tiến độ luận văn
      </Typography.Title>
      <Tabs items={items} className="p-5 bg-white rounded-md shadow-md" />
    </Layout.Content>
  );
}

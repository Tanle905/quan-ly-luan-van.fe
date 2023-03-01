import { Layout, Typography } from "antd";
import { AtomUploadButton } from "../../atoms/button/upload-button.atom";
import { MCThesisDefenseScheduleCalendar } from "../../molecules/calendar/thesis-defense-schedule-calendar.molecule";

export function OGScheduleContent() {
  return (
    <Layout.Content className="space-y-3 my-5 mx-20">
      <Layout.Content className="flex justify-between">
        <Typography.Title level={3} style={{ marginBottom: 0 }} className="m-0">
          Lịch biểu bảo vệ luận văn
        </Typography.Title>
        <AtomUploadButton href="" />
      </Layout.Content>
      <MCThesisDefenseScheduleCalendar />
    </Layout.Content>
  );
}

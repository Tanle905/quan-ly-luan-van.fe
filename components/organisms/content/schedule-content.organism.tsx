import { Button, Layout, Typography } from "antd";
import { useState } from "react";
import { MCThesisDefenseScheduleCalendar } from "../../molecules/calendar/thesis-defense-schedule-calendar.molecule";
import { MCAddEventModal } from "../../molecules/modal/add-event-modal.molecule";

export function OGScheduleContent() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <Layout.Content className="space-y-3 my-5 mx-20">
      <Layout.Content className="flex justify-between">
        <Typography.Title level={3} style={{ marginBottom: 0 }} className="m-0">
          Lịch biểu bảo vệ luận văn
        </Typography.Title>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Thêm buổi bận
        </Button>
      </Layout.Content>
      <MCThesisDefenseScheduleCalendar
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </Layout.Content>
  );
}

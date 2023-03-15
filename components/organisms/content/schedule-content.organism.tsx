import { Layout, Typography } from "antd";
import { useMount } from "../../../hooks/use-mount";
import { isAdmin } from "../../../utils/role.util";
import { MCThesisDefenseScheduleCalendar } from "../../molecules/calendar/thesis-defense-schedule-calendar.molecule";

interface OGScheduleContentProps {
  rightComponent?: any;
}

export function OGScheduleContent({ rightComponent }: OGScheduleContentProps) {
  const isMounted = useMount();

  if (!isMounted) return null;

  return (
    <Layout.Content className={`space-y-3 my-5 ${isAdmin() ? "" : "mx-20"}`}>
      <Layout.Content className="flex justify-between">
        <Typography.Title level={3} style={{ marginBottom: 0 }} className="m-0">
          Lịch biểu bảo vệ luận văn
        </Typography.Title>
        {rightComponent}
      </Layout.Content>
      <MCThesisDefenseScheduleCalendar />
    </Layout.Content>
  );
}

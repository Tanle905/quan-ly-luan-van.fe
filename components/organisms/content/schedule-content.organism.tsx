import { Divider, Layout, Typography } from "antd";
import { useMemo } from "react";
import { useMount } from "../../../hooks/use-mount";
import { isAdmin } from "../../../utils/role.util";
import { MCThesisDefenseScheduleCalendar } from "../../molecules/calendar/thesis-defense-schedule-calendar.molecule";
import { Roles } from "../../../constants/enums";

interface OGScheduleContentProps {
  rightComponent?: any;
  role: Roles;
}

export function OGScheduleContent({ rightComponent, role }: OGScheduleContentProps) {
  const isMounted = useMount();

  if (!isMounted) return null;

  return (
    <Layout.Content className={`space-y-3 my-5 ${role === Roles.ADMIN ? "" : "mx-5"}`}>
      <Layout.Content className="flex justify-between">
        <Layout.Content className="flex justify-start space-x-5">
          <Typography.Title
            level={3}
            style={{ marginBottom: 0 }}
            className="m-0"
          >
            Lịch biểu bảo vệ luận văn
          </Typography.Title>
          <ScheduleCalendarLegends />
        </Layout.Content>
        {rightComponent}
      </Layout.Content>
      <MCThesisDefenseScheduleCalendar role={role}/>
    </Layout.Content>
  );
}

export function ScheduleCalendarLegends() {
  const items = useMemo(() => {
    return [
      {
        icon: <div className="w-3 h-3 bg-[#edc1b8]"></div>,
        name: "Tuần nộp danh sách",
      },
      {
        icon: <div className="w-3 h-3 bg-[#c2dac0]"></div>,
        name: "Tuần báo cáo",
      },
      {
        icon: <div className="w-3 h-3 rounded-full bg-[#3788d8]"></div>,
        name: "Sự kiện",
      },
    ];
  }, []);

  return (
    <Layout.Content className="flex items-center space-x-2">
      {items.map((i, index) => (
        <>
          {index !== 0 && <Divider type="vertical" className="border-2" />}
          <Layout.Content className="flex items-center space-x-1">
            {i.icon}
            <Typography.Text className="text-xs">{i.name}</Typography.Text>
          </Layout.Content>
        </>
      ))}
    </Layout.Content>
  );
}

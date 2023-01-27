import daygrid from "@fullcalendar/daygrid";
import interaction from "@fullcalendar/interaction";
import moment from "@fullcalendar/moment";
import FullCalendar from "@fullcalendar/react";
import { Layout, Typography } from "antd";

interface AtomThesisProgressCalendarProps {}

export function AtomThesisProgressCalendar({}: AtomThesisProgressCalendarProps) {
  return (
    <>
      <Layout.Content className="my-2 mx-20">
        <Typography.Title level={3} style={{ marginBottom: 0 }} className="m-0">
          Báo cáo tiến độ luận văn
        </Typography.Title>
        <Layout.Content className="p-5 bg-white rounded-md shadow-md">
          <FullCalendar
            plugins={[daygrid, interaction, moment]}
            headerToolbar={{
              start: "title",
              center: "dayGridMonth,dayGridWeek",
              end: "prev,today,next",
            }}
            buttonText={{
              prev: "Tháng trước",
              today: "Hôm nay",
              next: "Tháng tới",
              dayGridMonth: "Xem theo tháng",
              dayGridWeek: "Xem theo tuần",
            }}
            views={{
              dayGrid: {
                titleFormat: {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                },
              },
            }}
            weekNumbers
            weekText="Tuần "
            selectable
            selectMirror
            locale="vi"
            firstDay={1}
            height={550}
          />
        </Layout.Content>
      </Layout.Content>
      <style>{`
.fc .fc-daygrid-day.fc-day-today {
    color: white;
    background-color: rgb(99 102 241);
}
  `}</style>
    </>
  );
}

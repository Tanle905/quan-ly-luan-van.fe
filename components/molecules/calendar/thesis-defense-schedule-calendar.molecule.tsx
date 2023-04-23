import daygrid from "@fullcalendar/daygrid";
import interaction from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { message, Layout, Tooltip } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import {
  baseURL,
  THESIS_DEFENSE_SCHEDULE_ENDPOINT,
} from "../../../constants/endpoints";
import { calendarEventSendSubject } from "../../../constants/observables";
import { Student } from "../../../interfaces/student.interface";
import { Teacher } from "../../../interfaces/teacher.interface";
import { userState } from "../../../stores/auth.store";
import useSWR from "swr";
import { clearCache } from "../../../utils/swr.util";
import { MCAddScheduleEventModal } from "../modal/add-schedule-event-modal.molecule";
import { isAdmin, isStudent, isTeacher } from "../../../utils/role.util";
import timegrid from "@fullcalendar/timegrid";
import dayjs from "dayjs";
import { MCAdminAddScheduleEventModal } from "../modal/admin-add-schedule-event-modal.molecule";
import { exportExcels } from "../../../utils/data-processing.util";
import { Roles } from "../../../constants/enums";

interface MCThesisDefenseScheduleCalendarProps {
  role: Roles;
}

export function MCThesisDefenseScheduleCalendar({
  role,
}: MCThesisDefenseScheduleCalendarProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDateData, setCurrentDateData] = useState<any>(null);
  const [currentEventData, setCurrentEventData] = useState<any[] | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const user = useRecoilValue<(Teacher & Student) | null>(userState);
  const { data, mutate, isLoading } = useSWR(
    isMounted &&
      baseURL +
        THESIS_DEFENSE_SCHEDULE_ENDPOINT.BASE +
        THESIS_DEFENSE_SCHEDULE_ENDPOINT.CALENDAR.BASE,
    thesisProgressEventFetcher
  );

  useEffect(() => {
    setIsMounted(true);
    const calendarEventSendSubscription = calendarEventSendSubject.subscribe({
      next: () => {
        mutate();
      },
    });

    return () => {
      clearCache(mutate);
      calendarEventSendSubscription.unsubscribe();
    };
  }, []);

  async function thesisProgressEventFetcher(url: string) {
    if (!user) return;
    try {
      const { data } = await axios.post(url, {
        MSCB: user.MSCB,
        MSSV: user.MSSV,
        role: role,
      });

      return data.data;
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  function handleTransformDataToEvent() {
    return data.reduce((prev: any, cur: any) => {
      return [...prev, ...(cur.slots ? cur.slots : [cur])];
    }, []);
  }

  if (!Array.isArray(data) || isLoading) return null;

  return (
    <>
      {role === Roles.ADMIN ? (
        <MCAdminAddScheduleEventModal
          isModalVisible={isModalVisible}
          setIsModelVisible={setIsModalVisible}
          currentDateData={currentDateData}
          currentEventData={currentEventData}
          setCurrentEventData={setCurrentEventData}
        />
      ) : (
        <MCAddScheduleEventModal
          isModalVisible={isModalVisible}
          setIsModelVisible={setIsModalVisible}
          currentDateData={currentDateData}
          currentEventData={currentEventData}
          setCurrentEventData={setCurrentEventData}
        />
      )}
      <Layout.Content className="p-5 bg-white rounded-md shadow-md">
        <FullCalendar
          plugins={[daygrid, timegrid, interaction]}
          headerToolbar={{
            start: "title",
            center: "dayGridMonth,dayGridWeek,timeGrid",
            end: "export prev,today,next",
          }}
          buttonText={{
            prev: "Trước",
            today: "Hôm nay",
            next: "Tới",
            dayGridMonth: "Tháng",
            dayGridWeek: "Tuần",
            timeGrid: "Ngày",
          }}
          views={{
            dayGrid: {
              titleFormat: {
                day: "2-digit",
                month: "long",
                year: "numeric",
              },
            },
            timeGrid: {
              type: "timeGrid",
              duration: { days: 1 },
            },
          }}
          customButtons={{
            export: {
              text: "Xuất lịch biểu",
              click: () => exportExcels(data),
            },
          }}
          dayMaxEventRows={0}
          events={handleTransformDataToEvent()}
          eventTimeFormat={{ hour: "numeric", minute: "2-digit" }}
          weekNumbers
          weekText="Tuần "
          selectable={false}
          selectMirror
          locale="vi"
          timeZone="none"
          firstDay={1}
          height={550}
          displayEventEnd
          windowResizeDelay={100}
          eventClassNames="cursor-pointer hover:-translate-y-[0.75px] transition-all"
          dateClick={(dateData) => {
            if (isStudent()) return;
            const filteredEventData = data.filter(
              (date) =>
                dayjs(date.start).format("DD-MM-YYYY") ===
                dayjs(dateData.date).format("DD-MM-YYYY")
            );
            setCurrentDateData(dateData);
            setCurrentEventData(
              filteredEventData.length > 0 ? filteredEventData : null
            );
            setIsModalVisible(true);
          }}
        />
      </Layout.Content>
      <style>{`
      .fc-daygrid-day:hover {
        cursor: pointer;
        background-color: rgb(230 230 230);
      }
      .fc .fc-daygrid-day.fc-day-today {
        color: white;
        background-color: rgb(99 102 241);
      }
  `}</style>
    </>
  );
}

import daygrid from "@fullcalendar/daygrid";
import interaction from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { message, Layout } from "antd";
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
import { isTeacher } from "../../../utils/role.util";
import timegrid from "@fullcalendar/timegrid";
import dayjs from "dayjs";

interface MCThesisDefenseScheduleCalendarProps {}

export function MCThesisDefenseScheduleCalendar({}: MCThesisDefenseScheduleCalendarProps) {
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
      const { data } = await axios.get(
        `${url}/?${isTeacher() ? "MSCB" : "MSSV"}=${
          isTeacher() ? user.MSCB : user.MSSV
        }`
      );

      return data.data;
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  if (!Array.isArray(data) || isLoading) return null;

  return (
    <>
      <MCAddScheduleEventModal
        isModalVisible={isModalVisible}
        setIsModelVisible={setIsModalVisible}
        currentDateData={currentDateData}
        currentEventData={currentEventData}
        setCurrentEventData={setCurrentEventData}
      />
      <Layout.Content className="p-5 bg-white rounded-md shadow-md">
        <FullCalendar
          plugins={[daygrid, timegrid, interaction]}
          headerToolbar={{
            start: "title",
            center: "dayGridMonth,dayGridWeek,timeGrid",
            end: "prev,today,next",
          }}
          buttonText={{
            prev: "Tr?????c",
            today: "H??m nay",
            next: "T???i",
            dayGridMonth: "Th??ng",
            dayGridWeek: "Tu???n",
            timeGrid: "Ng??y",
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
          events={data.reduce((prev: any, cur: any) => {
            return [...prev, ...cur.slots];
          }, [])}
          eventTimeFormat={{ hour: "2-digit", minute: "2-digit" }}
          displayEventEnd
          weekNumbers
          weekText="Tu???n "
          selectable={false}
          selectMirror
          locale="vi"
          timeZone="none"
          firstDay={1}
          height={550}
          eventClassNames="cursor-pointer hover:-translate-y-[0.75px] transition-all"
          dateClick={(dateData) => {
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
      <style global>{`
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

import daygrid from "@fullcalendar/daygrid";
import interaction from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { message, Layout } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { THESIS_PROGRESS_ENDPOINT } from "../../../constants/endpoints";
import { calendarEventSendSubject } from "../../../constants/observables";
import { Student } from "../../../interfaces/student.interface";
import { Teacher } from "../../../interfaces/teacher.interface";
import { userState } from "../../../stores/auth.store";
import { MCAddEventModal } from "../modal/add-event-modal.molecule";
import useSWR from "swr";
import moment from "@fullcalendar/moment";
import { clearCache } from "../../../utils/swr.util";

interface MCThesisDefenseScheduleCalendarProps {}

export function MCThesisDefenseScheduleCalendar({}: MCThesisDefenseScheduleCalendarProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDateData, setCurrentDateData] = useState<any>(null);
  const [currentEventData, setCurrentEventData] = useState<any | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const user = useRecoilValue<(Teacher & Student) | null>(userState);
  const [msg, contextHodler] = message.useMessage();
  // const { data, mutate } = useSWR(
  //   isMounted &&
  //     process.env.NEXT_PUBLIC_BASE_URL +
  //       THESIS_PROGRESS_ENDPOINT.BASE +
  //       THESIS_PROGRESS_ENDPOINT.EVENT,
  //   thesisProgressEventFetcher
  // );

  // useEffect(() => {
  //   setIsMounted(true);
  //   const calendarEventSendSubscription = calendarEventSendSubject.subscribe({
  //     next: () => {
  //       mutate();
  //     },
  //   });

  //   return () => {
  //     clearCache(mutate);
  //     calendarEventSendSubscription.unsubscribe();
  //   };
  // }, []);

  // async function thesisProgressEventFetcher() {
  //   if (!user) return;
  //   try {
  //     const { data } = await axios.post(
  //       process.env.NEXT_PUBLIC_BASE_URL + THESIS_PROGRESS_ENDPOINT.BASE,
  //       { MSSV: MSSV ? MSSV : user.MSSV }
  //     );

  //     return data.data;
  //   } catch (error: any) {
  //     message.error(error.response.data.message);
  //   }
  // }

  return (
    <>
      {contextHodler}
      <Layout.Content className="p-5 bg-white rounded-md shadow-md">
        <FullCalendar
          plugins={[daygrid, interaction, moment]}
          headerToolbar={{
            start: "title",
            center: "dayGridMonth,dayGridWeek",
            end: "prev,today,next",
          }}
          buttonText={{
            prev: "Trước",
            today: "Hôm nay",
            next: "Tới",
            dayGridMonth: "Tháng",
            dayGridWeek: "Tuần",
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
          // events={data}
          weekNumbers
          weekText="Tuần "
          selectable
          selectMirror
          locale="vi"
          firstDay={1}
          height={500}
          eventClassNames="cursor-pointer hover:-translate-y-[0.75px] transition-all"
          dateClick={(data) => {
            setCurrentDateData(data);
            setIsModalVisible(true);
          }}
          select={(data) => {
            setCurrentDateData(data);
            setIsModalVisible(true);
          }}
          eventClick={({ event }) => {
            setCurrentDateData(event);
            setCurrentEventData(event as any);
            setIsModalVisible(true);
          }}
        />
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

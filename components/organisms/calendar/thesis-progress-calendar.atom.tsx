import daygrid from "@fullcalendar/daygrid";
import interaction from "@fullcalendar/interaction";
import moment from "@fullcalendar/moment";
import FullCalendar from "@fullcalendar/react";
import { Layout, message, Typography } from "antd";
import { useEffect, useState } from "react";
import { MCAddEventModal } from "../../molecules/modal/add-event-modal.molecule";
import useSWR from "swr";
import {
  baseUrl,
  THESIS_PROGRESS_ENDPOINT,
} from "../../../constants/endpoints";
import { useRecoilValue } from "recoil";
import { userState } from "../../../stores/auth.store";
import axios from "axios";
import { Student } from "../../../interfaces/student.interface";
import { Teacher } from "../../../interfaces/teacher.interface";
import { ThesisProgress } from "../../../interfaces/thesis-progress.interface";
import { calendarEventSendSubject } from "../../../constants/observables";
import { cache } from "swr/_internal";

interface OGThesisProgressCalendarProps {
  MSSV?: string;
}

export function OGThesisProgressCalendar({
  MSSV,
}: OGThesisProgressCalendarProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDateData, setCurrentDateData] = useState<any>(null);
  const [currentEventData, setCurrentEventData] = useState<any | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { data, mutate } = useSWR(
    isMounted &&
      baseUrl + THESIS_PROGRESS_ENDPOINT.BASE + THESIS_PROGRESS_ENDPOINT.EVENT,
    thesisProgressEventFetcher
  );
  const user = useRecoilValue<(Teacher & Student) | null>(userState);
  const [msg, contextHodler] = message.useMessage();

  useEffect(() => {
    setIsMounted(true);
    const calendarEventSendSubscription = calendarEventSendSubject.subscribe({
      next: () => {
        mutate();
      },
    });

    return () => {
      clearCache();
      calendarEventSendSubscription.unsubscribe();
    };
  }, []);

  async function thesisProgressEventFetcher() {
    if (!user) return;
    try {
      const { data } = await axios.post(
        baseUrl + THESIS_PROGRESS_ENDPOINT.BASE,
        { MSSV: MSSV ? MSSV : user.MSSV },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );

      return data.data;
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  function clearCache() {
    mutate(() => true, undefined);
  }

  return (
    <>
      {contextHodler}
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
            events={data}
            weekNumbers
            weekText="Tuần "
            selectable
            selectMirror
            locale="vi"
            firstDay={1}
            height={550}
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
          {!MSSV && (
            <MCAddEventModal
              currentDateData={currentDateData}
              currentEventData={currentEventData}
              setCurrentEventData={setCurrentEventData}
              isModalVisible={isModalVisible}
              setIsModelVisible={setIsModalVisible}
            />
          )}
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

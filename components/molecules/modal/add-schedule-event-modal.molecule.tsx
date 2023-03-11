import { DateSelectArg } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import { Button, Form, message, Modal } from "antd";
import axios from "axios";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  COMMON_ENDPOINT,
  THESIS_DEFENSE_SCHEDULE_ENDPOINT,
  THESIS_PROGRESS_ENDPOINT,
} from "../../../constants/endpoints";
import {
  ScheduleEventType,
  Slot,
  ThesisStatus,
} from "../../../constants/enums";
import { calendarEventSendSubject } from "../../../constants/observables";
import { CalendarEvent } from "../../../interfaces/calendar.interface";
import { ScheduleEventTime } from "../../../interfaces/schedule.interface";
import { Student } from "../../../interfaces/student.interface";
import { userState } from "../../../stores/auth.store";
import { AtomLoadingButton } from "../../atoms/button/loading-button.atom";
import { MCAddScheduleEventForm } from "../form/add-schedule-event-form.molecule";

interface MCAddScheduleEventModalProps {
  isModalVisible: boolean;
  setIsModelVisible: any;
  currentDateData: (DateSelectArg & DateClickArg) | null;
  currentEventData: CalendarEvent | null;
  setCurrentEventData: any;
}

export function MCAddScheduleEventModal({
  isModalVisible,
  setIsModelVisible,
  currentDateData,
  currentEventData,
  setCurrentEventData,
}: MCAddScheduleEventModalProps) {
  const [isFormEditable, setIsFormEditable] = useState(true);
  const [msg, contextHodler] = message.useMessage();
  const [addEventForm] = Form.useForm();
  const user = useRecoilValue<Student | null>(userState);

  useEffect(() => {
    setIsFormEditable(currentEventData ? false : true);
  }, [currentEventData]);

  function handleCloseModal() {
    addEventForm.resetFields();
    setIsModelVisible(false);
    setCurrentEventData(null);
  }

  async function handleSaveEvent() {
    if (!user?.MSCB) return;

    const startDate: Dayjs = addEventForm.getFieldValue("date");
    const slots: { name: string; value: Slot }[] =
      addEventForm.getFieldValue("slot");
    const mappedSlots: Slot[] = slots.map((slot) => slot.value);
    const payload: ScheduleEventTime = {
      type: ScheduleEventType.BusyEvent,
      busyTimeData: {
        start: startDate.toDate(),
        MSCB: user.MSCB,
        teacherName: `${user.lastName} ${user.firstName}`,
        slots: mappedSlots,
      },
    };

    try {
      await axios[currentEventData ? "put" : "post"](
        process.env.NEXT_PUBLIC_BASE_URL +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.BASE +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.CALENDAR.BASE +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.CALENDAR.BUSY_LIST + COMMON_ENDPOINT.IMPORT,
        payload
      );
      calendarEventSendSubject.next(1);
      currentEventData
        ? message.success("Chỉnh sửa ngày bận thành công")
        : message.success("Thêm ngày bận thành công !");
      handleCloseModal();
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  async function handleDeleteEvent() {
    if (!user) return;

    try {
      await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL +
          THESIS_PROGRESS_ENDPOINT.BASE +
          THESIS_PROGRESS_ENDPOINT.EVENT.BASE +
          THESIS_PROGRESS_ENDPOINT.EVENT.DELETE,
        {
          id: currentEventData?.id,
          MSSV: user?.MSSV,
        }
      );
      calendarEventSendSubject.next(1);
      message.success("Xóa sự kiện thành công !");
      handleCloseModal();
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  return (
    <>
      {contextHodler}
      <Modal
        open={isModalVisible}
        title={currentEventData ? "Chỉnh sửa ngày bận" : "Thêm ngày bận"}
        destroyOnClose={true}
        closable
        onCancel={handleCloseModal}
        footer={[
          <Button type="text" onClick={handleCloseModal}>
            Hủy bỏ
          </Button>,
          currentEventData ? (
            <Button type="dashed" onClick={() => setIsFormEditable(true)}>
              Chỉnh sửa
            </Button>
          ) : (
            <></>
          ),
          currentEventData ? (
            <AtomLoadingButton
              onClick={handleDeleteEvent}
              buttonProps={{
                className:
                  "text-white bg-red-600 hover:bg-red-500 transition-all",
                type: "ghost",
              }}
            >
              Xóa sự kiện
            </AtomLoadingButton>
          ) : (
            <></>
          ),
          <AtomLoadingButton
            onClick={handleSaveEvent}
            buttonProps={{ type: "primary" }}
          >
            Lưu
          </AtomLoadingButton>,
        ]}
      >
        <MCAddScheduleEventForm
          isFormEditable={isFormEditable}
          currentDateData={currentDateData}
          form={addEventForm}
        />
      </Modal>
    </>
  );
}

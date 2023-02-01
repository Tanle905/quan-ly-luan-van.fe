import { DateSelectArg } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import { Button, Form, message, Modal } from "antd";
import axios from "axios";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  baseUrl,
  THESIS_PROGRESS_ENDPOINT,
} from "../../../constants/endpoints";
import { calendarEventSendSubject } from "../../../constants/observables";
import { CalendarEvent } from "../../../interfaces/calendar.interface";
import { Student } from "../../../interfaces/student.interface";
import { User } from "../../../interfaces/user.interface";
import { userState } from "../../../stores/auth.store";
import { MCAddEventForm } from "../form/add-event-form.molecule";

interface MCAddEventModalProps {
  isModalVisible: boolean;
  setIsModelVisible: any;
  currentDateData: (DateSelectArg & DateClickArg) | null;
  currentEventData: CalendarEvent | null;
  setCurrentEventData: any;
}

export function MCAddEventModal({
  isModalVisible,
  setIsModelVisible,
  currentDateData,
  currentEventData,
  setCurrentEventData,
}: MCAddEventModalProps) {
  const [isValid, setIsValid] = useState(false);
  const [isFormEditable, setIsFormEditable] = useState(true);
  const [msg, contextHodler] = message.useMessage();
  const [addEventForm] = Form.useForm();
  const user = useRecoilValue<Student | null>(userState);

  useEffect(() => {
    setIsFormEditable(currentEventData ? false : true);
  }, [currentEventData]);

  function handleCloseModal() {
    setIsValid(false);
    addEventForm.resetFields();
    setIsModelVisible(false);
    setCurrentEventData(null);
  }

  async function handleSaveEvent() {
    const startDate: Dayjs = addEventForm.getFieldValue("date")[0];
    const endDate: Dayjs = addEventForm.getFieldValue("date")[1];
    const title = addEventForm.getFieldValue("title");
    const description = addEventForm.getFieldValue("description");

    if (!user) return;

    try {
      await axios[currentEventData ? "put" : "post"](
        baseUrl +
          THESIS_PROGRESS_ENDPOINT.BASE +
          THESIS_PROGRESS_ENDPOINT.EVENT.BASE,
        {
          ...(currentEventData ? { id: currentEventData?.id } : {}),
          MSSV: user?.MSSV,
          MSCB: user.teacher?.MSCB,
          start: startDate.toISOString(),
          end: endDate.add(1, "day").toISOString(),
          title,
          description,
        }
      );
      calendarEventSendSubject.next(1);
      currentEventData
        ? message.success("Chỉnh sửa sự kiện thành công")
        : message.success("Thêm sự kiện thành công !");
      handleCloseModal();
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  async function handleDeleteEvent() {
    if (!user) return;

    try {
      await axios.post(
        baseUrl +
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
        title={currentEventData ? "Chỉnh sửa sự kiện" : "Thêm sự kiện"}
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
            <Button
              className="text-white bg-red-600 hover:bg-red-500 transition-all"
              type="ghost"
              onClick={handleDeleteEvent}
            >
              Xóa sự kiện
            </Button>
          ) : (
            <></>
          ),
          <Button type="primary" disabled={!isValid} onClick={handleSaveEvent}>
            Lưu
          </Button>,
        ]}
      >
        <MCAddEventForm
          isFormEditable={isFormEditable}
          currentDateData={currentDateData}
          currentEventData={currentEventData}
          form={addEventForm}
          setIsValid={setIsValid}
        />
      </Modal>
    </>
  );
}

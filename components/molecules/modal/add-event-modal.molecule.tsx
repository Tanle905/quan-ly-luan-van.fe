import { DateSelectArg } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import { Button, Form, message, Modal } from "antd";
import axios from "axios";
import { Dayjs } from "dayjs";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import {
  baseUrl,
  THESIS_PROGRESS_ENDPOINT,
} from "../../../constants/endpoints";
import { calendarEventSendSubject } from "../../../constants/observables";
import { CalendarEvent } from "../../../interfaces/calendar.interface";
import { User } from "../../../interfaces/user.interface";
import { userState } from "../../../stores/auth.store";
import { MCAddEventForm } from "../form/add-event-form.molecule";

interface MCAddEventModalProps {
  isModalVisible: boolean;
  setIsModelVisible: any;
  currentDateData: (DateSelectArg & DateClickArg) | null;
  currentEventData: CalendarEvent | null;
}

export function MCAddEventModal({
  isModalVisible,
  setIsModelVisible,
  currentDateData,
  currentEventData,
}: MCAddEventModalProps) {
  const [isValid, setIsValid] = useState(false);
  const [msg, contextHodler] = message.useMessage();
  const [addEventForm] = Form.useForm();
  const user = useRecoilValue<User | null>(userState);

  function handleCloseModal() {
    setIsValid(false);
    addEventForm.resetFields();
    setIsModelVisible(false);
  }

  async function handleSaveEvent() {
    const startDate: Dayjs = addEventForm.getFieldValue("date")[0];
    const endDate: Dayjs = addEventForm.getFieldValue("date")[1];
    const title = addEventForm.getFieldValue("title");

    if (!user) return;

    try {
      await axios.post(
        baseUrl +
          THESIS_PROGRESS_ENDPOINT.BASE +
          THESIS_PROGRESS_ENDPOINT.EVENT,
        {
          MSSV: user?.MSSV,
          start: startDate.toISOString(),
          end: endDate.add(1, "day").toISOString(),
          title,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
      calendarEventSendSubject.next(1);
      message.success("Thêm lịch thành công !");
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
        title="Thêm sự kiện"
        destroyOnClose={true}
        closable
        onCancel={handleCloseModal}
        footer={[
          <Button type="text" onClick={handleCloseModal}>
            Hủy bỏ
          </Button>,
          <Button type="primary" disabled={!isValid} onClick={handleSaveEvent}>
            Lưu
          </Button>,
        ]}
      >
        <MCAddEventForm
          currentDateData={currentDateData}
          currentEventData={currentEventData}
          form={addEventForm}
          setIsValid={setIsValid}
        />
      </Modal>
    </>
  );
}

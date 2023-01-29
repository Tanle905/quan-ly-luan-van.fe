import { DatePicker, Form, FormInstance, Input } from "antd";
import { DateSelectArg } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import dayjs from "dayjs";
import { useEffect } from "react";
import { handleValidateOnFieldChange } from "../../../utils/validation.util";
import { CalendarEvent } from "../../../interfaces/calendar.interface";

interface MCAddEventFormProps {
  currentDateData: (DateSelectArg & DateClickArg) | null;
  currentEventData: CalendarEvent | null;
  form: FormInstance;
  setIsValid: any;
}

export function MCAddEventForm({
  currentDateData,
  currentEventData,
  form,
  setIsValid,
}: MCAddEventFormProps) {
  const selectedDateRange = currentDateData?.date
    ? [dayjs(currentDateData.date), dayjs(currentDateData.date)]
    : [
        dayjs(currentDateData?.start),
        dayjs(currentDateData?.end).subtract(1, "day"),
      ];

  useEffect(() => {
    form.setFieldsValue({ date: selectedDateRange });
    if (currentEventData) {
      form.setFieldsValue({ title: currentEventData.title });
    }
  }, []);

  return (
    <Form
      form={form}
      onValuesChange={() => handleValidateOnFieldChange(form, setIsValid)}
    >
      <Form.Item label={"Thời gian"} name="date" required>
        <DatePicker.RangePicker format={"DD-MM-YYYY"} />
      </Form.Item>
      <Form.Item label={"Nội dung"} name="title" required>
        <Input.TextArea rows={5} />
      </Form.Item>
    </Form>
  );
}

import { DatePicker, Form, FormInstance, Input } from "antd";
import { DateSelectArg } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import dayjs from "dayjs";
import { useEffect } from "react";
import { handleValidateOnFieldChange } from "../../../utils/validation.util";

interface MCAddEventFormProps {
  currentDateData: (DateSelectArg & DateClickArg) | null;
  currentEventData: any | null;
  form: FormInstance;
  isFormEditable: boolean;
  setIsValid: any;
}

export function MCAddEventForm({
  currentDateData,
  currentEventData,
  form,
  isFormEditable,
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
      form.setFieldsValue({
        description: currentEventData.extendedProps?.description,
      });
    }
  }, []);

  return (
    <Form
      form={form}
      onFieldsChange={() => setIsValid(handleValidateOnFieldChange(form))}
      layout="vertical"
    >
      <Form.Item label={"Thời gian"} name="date" required>
        <DatePicker.RangePicker
          format={"DD-MM-YYYY"}
          className="w-full"
          disabled={!isFormEditable}
        />
      </Form.Item>
      <Form.Item
        label={"Tiêu đề"}
        name="title"
        rules={[{ required: true }]}
        required
      >
        <Input disabled={!isFormEditable} />
      </Form.Item>
      <Form.Item
        label={"Nội dung"}
        name="description"
        rules={[{ required: true }]}
        required
      >
        <Input.TextArea rows={5} disabled={!isFormEditable} />
      </Form.Item>
    </Form>
  );
}

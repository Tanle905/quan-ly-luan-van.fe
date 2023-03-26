import { DatePicker, Form, FormInstance, message, Modal } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect } from "react";
import useSWR from "swr";
import {
  baseURL,
  THESIS_DEFENSE_SCHEDULE_ENDPOINT,
} from "../../../constants/endpoints";
import { ScheduleCalendar } from "../../../interfaces/schedule.interface";

interface MCAdminScheduleManagementModalProps {
  isOpen: boolean;
  setIsOpen: any;
}

interface ModalContent {
  data: ScheduleCalendar;
  form: FormInstance;
}

export function MCAdminScheduleManagementModal({
  isOpen,
  setIsOpen,
}: MCAdminScheduleManagementModalProps) {
  const { data } = useSWR(
    THESIS_DEFENSE_SCHEDULE_ENDPOINT.BASE +
      THESIS_DEFENSE_SCHEDULE_ENDPOINT.CALENDAR.BASE,
    dataFetcher
  );
  const [form] = Form.useForm();

  async function dataFetcher(url: string) {
    try {
      return await (
        await axios.get(baseURL + url)
      ).data.data;
    } catch (error: any) {
      message.error(error.response?.data?.message);
    }
  }

  function handleOnOk() {
    form.submit();
  }

  function handleCloseModal() {
    setIsOpen(false);
  }

  return (
    <Modal
      title="Quản lí lịch biểu"
      open={isOpen}
      onOk={handleOnOk}
      onCancel={handleCloseModal}
      destroyOnClose
      closable
    >
      <ModalContent data={data} form={form} />
    </Modal>
  );
}

function ModalContent({ data, form }: ModalContent) {
  useEffect(() => {
    if (!data) return;

    data.reportPrepareWeek &&
      form.setFieldValue("reportPrepareWeek", [
        dayjs(data.reportPrepareWeek.start),
        dayjs(data.reportPrepareWeek.end),
      ]);
    data.thesisDefenseWeek &&
      form.setFieldValue("thesisDefenseWeek", [
        dayjs(data.thesisDefenseWeek.start),
        dayjs(data.thesisDefenseWeek.end),
      ]);
  }, [data]);

  async function handleSubmitForm() {
    const reportPrepareWeek = form.getFieldValue("reportPrepareWeek");
    const thesisDefenseWeek = form.getFieldValue("thesisDefenseWeek");
    const payload = {
      reportPrepareWeek: {
        start: reportPrepareWeek[0].utcOffset(0).startOf("day").toDate(),
        end: reportPrepareWeek[1].utcOffset(0).startOf("day").toDate(),
      },
      thesisDefenseWeek: {
        start: thesisDefenseWeek[0].utcOffset(0).startOf("day").toDate(),
        end: thesisDefenseWeek[1].utcOffset(0).startOf("day").toDate(),
      },
    };

    try {
      await axios.put(
        baseURL +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.BASE +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.CALENDAR.BASE,
        payload
      );

      message.success("Cập nhật lịch biểu thành công");
    } catch (error: any) {
      message.error(error.response?.data?.message);
    }
  }

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmitForm}>
      <Form.Item label="Tuần lễ nộp danh sách báo cáo" name="reportPrepareWeek">
        <DatePicker.RangePicker className="w-full" format="DD-MM-YYYY" />
      </Form.Item>
      <Form.Item label="Tuần lễ báo cáo" name="thesisDefenseWeek">
        <DatePicker.RangePicker className="w-full" format="DD-MM-YYYY" />
      </Form.Item>
    </Form>
  );
}

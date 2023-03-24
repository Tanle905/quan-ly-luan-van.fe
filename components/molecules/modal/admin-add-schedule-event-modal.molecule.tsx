import { DateSelectArg } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import {
  Button,
  Form,
  FormInstance,
  Layout,
  message,
  Modal,
  Select,
} from "antd";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  baseURL,
  COMMON_ENDPOINT,
  TEACHER_ENDPOINT,
  THESIS_DEFENSE_SCHEDULE_ENDPOINT,
} from "../../../constants/endpoints";
import { ScheduleEventType, Slot } from "../../../constants/enums";
import { calendarEventSendSubject } from "../../../constants/observables";
import { ScheduleEventTime } from "../../../interfaces/schedule.interface";
import { Student } from "../../../interfaces/student.interface";
import { userState } from "../../../stores/auth.store";
import { AtomLoadingButton } from "../../atoms/button/loading-button.atom";
import { MCAddScheduleEventForm } from "../form/add-schedule-event-form.molecule";
import useSWR from "swr";

interface MCAdminAddScheduleEventModalProps {
  isModalVisible: boolean;
  setIsModelVisible: any;
  currentDateData: (DateSelectArg & DateClickArg) | null;
  currentEventData: any[] | null;
  setCurrentEventData: any;
}

interface StudentListFormProps {
  form: FormInstance;
  studentLists: any[];
  scheduleEventList: ScheduleEventTime[];
  setMSCBList: any;
}

export function MCAdminAddScheduleEventModal({
  isModalVisible,
  setIsModelVisible,
  currentDateData,
  currentEventData,
  setCurrentEventData,
}: MCAdminAddScheduleEventModalProps) {
  const [isFormEditable, setIsFormEditable] = useState(true);
  const [MSCBList, setMSCBList] = useState<any>([]);
  const [filledSlots, setFilledSlots] = useState<Slot[]>([]);
  const [studentListForm] = Form.useForm();
  const [addEventForm] = Form.useForm();
  const user = useRecoilValue<Student | null>(userState);
  const { data } = useSWR(
    baseURL +
      THESIS_DEFENSE_SCHEDULE_ENDPOINT.BASE +
      THESIS_DEFENSE_SCHEDULE_ENDPOINT.STUDENT_LIST.BASE,
    fetchStudentList
  );

  useEffect(() => {
    setIsFormEditable(currentEventData ? false : true);
  }, [currentEventData]);

  function handleCloseModal() {
    studentListForm.resetFields();
    addEventForm.resetFields();
    setIsModelVisible(false);
    setCurrentEventData(null);
    setFilledSlots([]);
  }

  async function fetchStudentList(url: string) {
    return await (
      await axios.get(url)
    ).data?.data;
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
        baseURL +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.BASE +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.CALENDAR.BASE +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.CALENDAR.BUSY_LIST +
          COMMON_ENDPOINT.IMPORT,
        {
          ...payload,
          ...(currentEventData ? { id: currentEventData[0].id } : {}),
        }
      );
      calendarEventSendSubject.next(1);
      currentEventData
        ? message.success("Chỉnh sửa buổi báo cáo thành công")
        : message.success("Thêm buổi báo cáo thành công !");
      handleCloseModal();
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  async function handleDeleteEvent() {
    if (!user || !currentEventData) return;

    try {
      await axios.post(
        baseURL +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.BASE +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.CALENDAR.BASE +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.CALENDAR.BUSY_LIST,
        {
          id: currentEventData[0].id,
          MSSV: user?.MSSV,
        }
      );
      calendarEventSendSubject.next(1);
      message.success("Xóa buổi báo cáo thành công !");
      handleCloseModal();
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  function parseDate(date: Date) {
    return dayjs(date).format("DD-MM-YYYY");
  }

  function handleFilterSlots() {
    if (!currentDateData || !data || !MSCBList) return;

    const parsedSelectedDate =
      currentDateData.date && parseDate(currentDateData.date);
    const filledSlots = data.calendar.scheduleEventList
      .filter((e: any) => {
        //Check today if any teacher in selected list have busy or thesis event
        return (
          [
            e.busyTimeData && parseDate(e.busyTimeData.start),
            e.thesisDefenseTimeData && parseDate(e.thesisDefenseTimeData.start),
          ].includes(parsedSelectedDate) &&
          (MSCBList.includes(e.busyTimeData?.MSCB) ||
            MSCBList.find((teacher: any) =>
              e.thesisDefenseTimeData?.MSCB.includes(teacher)
            ))
        );
      })
      .reduce(
        (prev: any, cur: any) => [
          ...prev,
          ...(cur.busyTimeData
            ? cur.busyTimeData.slots
            : cur.thesisDefenseTimeData
            ? [cur.thesisDefenseTimeData.slots]
            : []),
        ],
        []
      );

    setFilledSlots(filledSlots);
  }

  useEffect(() => {
    handleFilterSlots();
  }, [MSCBList]);

  return (
    <>
      <Modal
        open={isModalVisible}
        title={
          currentEventData ? "Chỉnh sửa buổi báo cáo" : "Thêm buổi báo cáo"
        }
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
              Xóa buổi báo cáo
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
        <StudentListForm
          form={studentListForm}
          studentLists={data?.studentLists}
          scheduleEventList={data?.calendar?.scheduleEventList}
          setMSCBList={setMSCBList}
        />
        <MCAddScheduleEventForm
          title="Chọn buổi báo cáo"
          isFormEditable={isFormEditable}
          currentDateData={currentDateData}
          form={addEventForm}
          disabledSlots={filledSlots}
        />
      </Modal>
    </>
  );
}

function StudentListForm({
  studentLists,
  scheduleEventList,
  form,
  setMSCBList,
}: StudentListFormProps) {
  const [selectedStudent, setSelectedStudent] = useState(false);
  const { data } = useSWR(baseURL + TEACHER_ENDPOINT.BASE, fetchTeacher);

  useEffect(() => {}, [selectedStudent]);

  async function fetchTeacher(url: string) {
    return (await axios.post(url)).data?.data;
  }

  function handleMapStudent() {
    return studentLists.reduce(
      (prevList, curList) => [
        ...prevList,
        ...curList.students.map((student: any) => {
          return {
            label: `${student.lastName} ${student.firstName} - ${curList.teacherName} phụ trách`,
            value: student.MSSV,
            disabled: scheduleEventList.find(
              (e) => e.thesisDefenseTimeData?.MSSV === student.MSSV
            ),
          };
        }),
      ],
      []
    );
  }

  return (
    <Layout.Content>
      <Form form={form} layout="vertical">
        <Form.Item label="Chọn sinh viên" name="MSSV">
          <Select
            options={handleMapStudent() ?? []}
            onChange={(value) => setSelectedStudent(true)}
          ></Select>
        </Form.Item>
        <Form.Item label="Chọn giảng viên hướng dẫn (3 người)" name="MSCB">
          <Select
            disabled={!selectedStudent}
            mode="multiple"
            filterOption={(input, option) =>
              (option?.value as string)
                ?.toLowerCase()
                .indexOf(input.toLowerCase()) >= 0 ||
              (option?.label as string)
                ?.toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            options={
              data?.map((teacher: any) => ({
                label: `${teacher.lastName} ${teacher.firstName}`,
                value: teacher.MSCB,
              })) ?? []
            }
            onChange={(value) => {
              if (value?.length > 3) {
                value.pop();
                return;
              }
              setMSCBList(value);
            }}
          ></Select>
        </Form.Item>
      </Form>
    </Layout.Content>
  );
}

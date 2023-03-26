import { DateSelectArg } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import {
  Button,
  Form,
  FormInstance,
  Input,
  Layout,
  message,
  Modal,
  Select,
  Tabs,
} from "antd";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  baseURL,
  TEACHER_ENDPOINT,
  THESIS_DEFENSE_SCHEDULE_ENDPOINT,
} from "../../../constants/endpoints";
import { Slot } from "../../../constants/enums";
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
  MSCBList: string[];
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
  const items = [
    {
      key: "1",
      label: `Thêm lịch`,
      children: (
        <>
          <StudentListForm
            form={studentListForm}
            studentLists={data?.studentLists}
            scheduleEventList={data?.calendar?.scheduleEventList}
            MSCBList={MSCBList}
            setMSCBList={setMSCBList}
          />
          <MCAddScheduleEventForm
            mode="single"
            title="Chọn buổi báo cáo"
            isFormEditable={isFormEditable}
            currentDateData={currentDateData}
            form={addEventForm}
            disabledSlots={filledSlots}
          />
        </>
      ),
    },
    {
      key: "2",
      label: `Chỉnh sửa lịch`,
      children: (
        <>
          <StudentListForm
            form={studentListForm}
            studentLists={data?.studentLists}
            scheduleEventList={data?.calendar?.scheduleEventList}
            MSCBList={MSCBList}
            setMSCBList={setMSCBList}
          />
          <MCAddScheduleEventForm
            mode="single"
            title="Chọn buổi báo cáo"
            isFormEditable={isFormEditable}
            currentDateData={currentDateData}
            form={addEventForm}
            disabledSlots={filledSlots}
          />
        </>
      ),
      disabled: true,
    },
  ];

  useEffect(() => {
    setIsFormEditable(currentEventData ? false : true);
  }, [currentEventData]);

  function handleCloseModal() {
    studentListForm.resetFields();
    addEventForm.resetFields();
    setIsModelVisible(false);
    setCurrentEventData(null);
    setMSCBList([]);
    setFilledSlots([]);
  }

  async function fetchStudentList(url: string) {
    return await (
      await axios.get(url)
    ).data?.data;
  }

  async function handleSaveEvent() {
    const startDate: Dayjs = addEventForm.getFieldValue("date");
    const MSSV = studentListForm.getFieldValue("MSSV");
    const teacherName = studentListForm.getFieldValue("teacherName");
    const studentName = studentListForm.getFieldValue("studentName");
    const slots: { name: string; value: Slot }[] =
      addEventForm.getFieldValue("slot");

    if (!slots.length) return;

    const payload = {
      start: startDate.toDate(),
      MSCB: MSCBList,
      MSSV,
      teacherName,
      studentName,
      slots: slots[0].value,
    };

    try {
      await axios[false ? "put" : "post"](
        baseURL +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.BASE +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.CALENDAR.BASE +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.CALENDAR.THESIS_DEFENSE_TIME,
        {
          ...payload,
          ...(currentEventData && { id: currentEventData[0].id }),
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
        title="Quản lý lịch báo cáo"
        destroyOnClose={true}
        closable
        onCancel={handleCloseModal}
        footer={[
          <Button type="text" onClick={handleCloseModal}>
            Hủy bỏ
          </Button>,
          <AtomLoadingButton
            onClick={handleSaveEvent}
            buttonProps={{ type: "primary" }}
          >
            Lưu
          </AtomLoadingButton>,
        ]}
      >
        <Tabs items={items} />
      </Modal>
    </>
  );
}

function StudentListForm({
  studentLists,
  scheduleEventList,
  form,
  MSCBList,
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
        ...curList.students
          .map((student: any) => {
            const isScheduled = scheduleEventList.find(
              (e) => e.thesisDefenseTimeData?.MSSV === student.MSSV
            );

            return isScheduled
              ? null
              : {
                  title: `${curList.teacherName}:${curList.MSCB}`,
                  label: `${student.lastName} ${student.firstName} - ${curList.teacherName} phụ trách`,
                  value: student.MSSV,
                };
          })
          .filter((item: any) => item),
      ],
      []
    );
  }

  function handleMapTeacher() {
    const options =
      data
        ?.map((teacher: any) => ({
          label: `${teacher.lastName} ${teacher.firstName}`,
          value: teacher.MSCB,
        }))
        .filter((option: any) => !MSCBList.includes(option.value)) ?? [];
    return options;
  }

  function handleSetMSCBList() {
    const list = [
      ...(form.getFieldValue("teacher1")
        ? [form.getFieldValue("teacher1")]
        : []),
      ...(form.getFieldValue("teacher2")
        ? [form.getFieldValue("teacher2")]
        : []),
      ...(form.getFieldValue("teacher3")
        ? [form.getFieldValue("teacher3")]
        : []),
    ];
    setMSCBList(list);
  }

  function filterOption(input: any, option: any) {
    return (
      (option?.value as string)?.toLowerCase().indexOf(input.toLowerCase()) >=
        0 ||
      (option?.label as string)?.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  }

  return (
    <Layout.Content>
      <Form form={form} layout="vertical">
        <Form.Item label="Chọn sinh viên" name="MSSV">
          <Select
            options={handleMapStudent() ?? []}
            filterOption={filterOption}
            onChange={(value, option: any) => {
              setSelectedStudent(true);
              form.setFieldValue("teacherName", option.title.split(":")[0]);
              form.setFieldValue("teacher1", option.title.split(":")[1]);
              handleSetMSCBList();
              form.setFieldValue("studentName", option.label);
            }}
          ></Select>
        </Form.Item>
        <Form.Item label="Thư kí" className="readOnly" name="teacherName">
          <Input readOnly />
        </Form.Item>
        <Form.Item label="Thư kí" hidden className="readOnly" name="teacher1">
          <Input readOnly />
        </Form.Item>
        <Form.Item label="Phản biện" name="teacher2">
          <Select
            allowClear
            onClear={handleSetMSCBList}
            disabled={!selectedStudent}
            options={handleMapTeacher()}
            filterOption={filterOption}
            onChange={handleSetMSCBList}
          ></Select>
        </Form.Item>
        <Form.Item label="Chủ trì hội đồng" name="teacher3">
          <Select
            allowClear
            onClear={handleSetMSCBList}
            disabled={!selectedStudent}
            options={handleMapTeacher()}
            filterOption={filterOption}
            onChange={handleSetMSCBList}
          ></Select>
        </Form.Item>
      </Form>
    </Layout.Content>
  );
}

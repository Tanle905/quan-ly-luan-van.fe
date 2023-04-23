import { DateSelectArg } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import {
  Button,
  Collapse,
  Dropdown,
  Form,
  FormInstance,
  Input,
  Layout,
  Menu,
  message,
  Modal,
  Select,
  Tabs,
  Typography,
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
import { ScheduleEventType, Slot } from "../../../constants/enums";
import { calendarEventSendSubject } from "../../../constants/observables";
import { ScheduleEventTime } from "../../../interfaces/schedule.interface";
import { Student } from "../../../interfaces/student.interface";
import { userState } from "../../../stores/auth.store";
import { AtomLoadingButton } from "../../atoms/button/loading-button.atom";
import {
  MCAddScheduleEventForm,
  slotsData,
} from "../form/add-schedule-event-form.molecule";
import useSWR from "swr";
import { Teacher } from "../../../interfaces/teacher.interface";
import { Topic } from "../../../interfaces/topic.interface";
import { MoreOutlined } from "@ant-design/icons";

interface MCAdminAddScheduleEventModalProps {
  isModalVisible: boolean;
  setIsModelVisible: any;
  currentDateData: (DateSelectArg & DateClickArg) | null;
  currentEventData: any[] | null;
  setCurrentEventData: any;
}

interface StudentListFormProps {
  form: FormInstance;
  teacherList: Teacher[];
  studentLists: any[];
  scheduleEventList: ScheduleEventTime[];
  MSCBList: string[];
  setMSCBList: any;
}

interface ThesisDefenseEventsProps {
  teacherList: Teacher[];
  dateList: ScheduleEventTime[];
  mutateDateList: any;
  mutateStudentList: any;
}

const items = (
  children: (mode: "add" | "edit") => JSX.Element,
  disabled: boolean
) => [
  {
    key: "1",
    label: `Thêm lịch`,
    children: children("add"),
  },
  {
    key: "2",
    label: `Chi tiết lịch`,
    children: children("edit"),
    disabled,
  },
];

export function MCAdminAddScheduleEventModal({
  isModalVisible,
  setIsModelVisible,
  currentDateData,
  currentEventData,
  setCurrentEventData,
}: MCAdminAddScheduleEventModalProps) {
  const [activeKey, setActiveKey] = useState(1);
  const [isFormEditable, setIsFormEditable] = useState(true);
  const [MSCBList, setMSCBList] = useState<any[]>([]);
  const [filledSlots, setFilledSlots] = useState<Slot[]>([]);
  const [studentListForm] = Form.useForm();
  const [addEventForm] = Form.useForm();
  const user = useRecoilValue<Student | null>(userState);
  const { data: teacherList } = useSWR(
    baseURL + TEACHER_ENDPOINT.BASE,
    fetchTeacher
  );
  const { data: studentList, mutate: mutateStudentList } = useSWR(
    baseURL +
      THESIS_DEFENSE_SCHEDULE_ENDPOINT.BASE +
      THESIS_DEFENSE_SCHEDULE_ENDPOINT.STUDENT_LIST.BASE,
    fetchList
  );
  const { data: selectedDateList, mutate: mutateDateList } = useSWR(
    baseURL +
      THESIS_DEFENSE_SCHEDULE_ENDPOINT.BASE +
      THESIS_DEFENSE_SCHEDULE_ENDPOINT.CALENDAR.BASE +
      "/" +
      dayjs(currentDateData?.date).toDate(),
    fetchList
  );

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
    setActiveKey(1);
  }

  async function fetchList(url: string) {
    return await (
      await axios.get(url)
    ).data?.data;
  }

  async function fetchTeacher(url: string) {
    return (await axios.post(url)).data?.data;
  }

  async function handleSaveEvent() {
    try {
      const slots: { name: string; value: Slot }[] =
        addEventForm.getFieldValue("slot");

      if (!slots.length) throw new Error("Hãy chọn khung giờ báo cáo");

      if (MSCBList.length < 3)
        throw new Error("Hãy chọn đủ 3 thành viên tham gia báo cáo");

      const startDate: Dayjs = addEventForm.getFieldValue("date");
      const MSSV = studentListForm.getFieldValue("MSSV");
      const teacherName = studentListForm.getFieldValue("teacherName");
      const studentName = studentListForm.getFieldValue("studentName");

      const payload = {
        start: startDate.toDate(),
        MSCB: MSCBList,
        MSSV,
        teacherName,
        studentName,
        slots: slots[0].value,
      };

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
      calendarEventSendSubject.next(1);
      handleCloseModal();
      mutateDateList();
      mutateStudentList();
    } catch (error: any) {
      message.error(error?.response?.data?.message || error?.message);
    }
  }

  function parseDate(date: Date) {
    return dayjs(date).format("DD-MM-YYYY");
  }

  function handleFilterSlots() {
    if (!currentDateData || !studentList || !MSCBList) return;

    const parsedSelectedDate =
      currentDateData.date && parseDate(currentDateData.date);
    const filledSlots = studentList.calendar.scheduleEventList
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
        footer={
          activeKey === 1
            ? [
                <Button type="text" onClick={handleCloseModal}>
                  Hủy bỏ
                </Button>,
                <AtomLoadingButton
                  onClick={handleSaveEvent}
                  buttonProps={{ type: "primary" }}
                >
                  Lưu
                </AtomLoadingButton>,
              ]
            : null
        }
      >
        <Tabs
          onTabClick={(key) => setActiveKey(parseInt(key))}
          items={items(
            (mode) =>
              mode === "add" ? (
                <>
                  <StudentListForm
                    teacherList={teacherList}
                    form={studentListForm}
                    studentLists={studentList?.studentLists}
                    scheduleEventList={studentList?.calendar?.scheduleEventList}
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
              ) : (
                <ThesisDefenseEvents
                  teacherList={teacherList}
                  dateList={selectedDateList}
                  mutateDateList={mutateDateList}
                  mutateStudentList={mutateStudentList}
                />
              ),
            !selectedDateList?.filter(
              (e: any) => e.type === ScheduleEventType.ThesisDefenseEvent
            ).length
          )}
        />
      </Modal>
    </>
  );
}

function StudentListForm({
  teacherList,
  studentLists,
  scheduleEventList,
  form,
  MSCBList,
  setMSCBList,
}: StudentListFormProps) {
  const [selectedStudent, setSelectedStudent] = useState(false);
  const [teacherOptions, setTeacherOptions] = useState(handleMapTeacher());

  useEffect(() => {
    setTeacherOptions(handleMapTeacher());
  }, [selectedStudent]);

  useEffect(() => {
    setTeacherOptions(handleMapTeacher());
  }, [MSCBList]);

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
      teacherList
        ?.map((teacher: any) => ({
          label: `${teacher.lastName} ${teacher.firstName}`,
          value: teacher.MSCB,
        }))
        .filter((option: any) => !MSCBList.includes(option.value)) ?? [];
    return options;
  }

  function handleSetMSCBList() {
    const list = [
      ...(form.getFieldValue("teacher3")
        ? [form.getFieldValue("teacher3")]
        : []),
      ...(form.getFieldValue("teacher2")
        ? [form.getFieldValue("teacher2")]
        : []),
      ...(form.getFieldValue("teacher1")
        ? [form.getFieldValue("teacher1")]
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
              form.resetFields();
              setSelectedStudent(true);
              form.setFieldValue("MSSV", value);
              form.setFieldValue("studentName", option.label.split(" - ")[0]);
              form.setFieldValue("teacherName", option.title.split(":")[0]);
              form.setFieldValue("teacher1", option.title.split(":")[1]);
              handleSetMSCBList();
            }}
          ></Select>
        </Form.Item>
        <Form.Item label="Thư kí" className="readOnly" name="teacherName">
          <Input readOnly />
        </Form.Item>
        <Form.Item hidden className="readOnly" name="teacher1">
          <Input readOnly />
        </Form.Item>
        <Form.Item label="Phản biện" name="teacher2">
          <Select
            allowClear
            onClear={handleSetMSCBList}
            disabled={!selectedStudent}
            options={teacherOptions}
            filterOption={filterOption}
            onChange={handleSetMSCBList}
          ></Select>
        </Form.Item>
        <Form.Item label="Chủ trì hội đồng" name="teacher3">
          <Select
            allowClear
            onClear={handleSetMSCBList}
            disabled={!selectedStudent}
            options={teacherOptions}
            filterOption={filterOption}
            onChange={handleSetMSCBList}
          ></Select>
        </Form.Item>
      </Form>
    </Layout.Content>
  );
}

function ThesisDefenseEvents({
  teacherList,
  dateList,
  mutateDateList,
  mutateStudentList,
}: ThesisDefenseEventsProps) {
  const items = dateList?.map(
    (event, index) =>
      event.type === ScheduleEventType.ThesisDefenseEvent && (
        <Collapse.Panel
          key={index}
          extra={
            <Dropdown
              menu={{
                items: [
                  {
                    key: "1",
                    label: (
                      <Typography.Text
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(event._id);
                        }}
                      >
                        Xóa buổi báo cáo
                      </Typography.Text>
                    ),
                  },
                ],
              }}
            >
              <MoreOutlined onClick={(e) => e.stopPropagation()} />
            </Dropdown>
          }
          header={`${
            slotsData.find(
              (slot) => slot.value === event.thesisDefenseTimeData?.slots
            )?.name
          } / ${event.thesisDefenseTimeData?.studentName}`}
        >
          <div>
            <span className="font-semibold">Thư kí: </span>
            <span>
              {`${
                findTeacher(event.thesisDefenseTimeData?.MSCB[2])?.lastName
              } ${
                findTeacher(event.thesisDefenseTimeData?.MSCB[2])?.firstName
              }`}
            </span>
          </div>
          <div>
            <span className="font-semibold">Phản biện: </span>
            <span>
              {`${
                findTeacher(event.thesisDefenseTimeData?.MSCB[1])?.lastName
              } ${
                findTeacher(event.thesisDefenseTimeData?.MSCB[1])?.firstName
              }`}
            </span>
          </div>
          <div>
            <span className="font-semibold">Chủ tịch hội đồng: </span>
            <span>
              {`${
                findTeacher(event.thesisDefenseTimeData?.MSCB[0])?.lastName
              } ${
                findTeacher(event.thesisDefenseTimeData?.MSCB[0])?.firstName
              }`}
            </span>
          </div>
          <div>
            <span className="font-semibold">Đề tài: </span>
            <span>
              {
                (event.thesisDefenseTimeData?.topic as unknown as Topic)
                  .topicName
              }
            </span>
          </div>
        </Collapse.Panel>
      )
  );

  function findTeacher(MSCB: string | undefined) {
    return teacherList.find((t) => t.MSCB === MSCB);
  }

  async function handleDeleteEvent(id: string | undefined) {
    try {
      await axios.delete(
        baseURL +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.BASE +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.CALENDAR.BASE +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.CALENDAR.THESIS_DEFENSE_TIME +
          "/" +
          id
      );
      message.success("Xóa buổi báo cáo thành công");
      mutateDateList();
      mutateStudentList();
      calendarEventSendSubject.next(1);
    } catch (error: any) {
      message.error(error.response?.data?.message);
    }
  }

  return <Collapse>{items}</Collapse>;
}

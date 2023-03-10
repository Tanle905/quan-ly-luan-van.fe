import {
  Layout,
  message,
  RadioChangeEvent,
  TableProps,
  Tabs,
  TabsProps,
  Typography,
} from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import axios from "axios";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { sentRequestListConfig } from "../../../config/student/sent-request-list.config";
import { teacherListConfig } from "../../../config/student/teacher-list-config";
import { receivedRequestListConfig } from "../../../config/teacher/received-request-list.config";
import { studentListConfig } from "../../../config/teacher/student-list.config";
import { thesisDefenseStudentListConfig } from "../../../config/teacher/thesis-defense-student-list.config";
import {
  baseURL,
  THESIS_DEFENSE_SCHEDULE_ENDPOINT,
  COMMON_ENDPOINT,
} from "../../../constants/endpoints";
import { ThesisStatus } from "../../../constants/enums";
import { reloadProfileSubject } from "../../../constants/observables";
import { useMount } from "../../../hooks/use-mount";
import { StudentList } from "../../../interfaces/schedule.interface";
import { Student } from "../../../interfaces/student.interface";
import { Teacher } from "../../../interfaces/teacher.interface";
import { userState } from "../../../stores/auth.store";
import { isTeacher } from "../../../utils/role.util";
import { OGTable } from "../table/table.organism";

interface OGMainContentProps {}

const studentContentItems: TabsProps["items"] = [
  {
    key: "1",
    label: `Tất cả`,
    children: <OGTable config={teacherListConfig} key={1} />,
  },
  {
    key: "2",
    label: `Đã gửi yêu cầu`,
    children: <OGTable config={sentRequestListConfig} key={2} />,
  },
];

export function OGMainContent({}: OGMainContentProps) {
  const isMounted = useMount();

  return (
    <Layout.Content className="mx-20 my-5 space-y-3">
      <Typography.Title level={3} style={{ marginBottom: 0 }} className="m-0">
        Danh sách {isMounted && isTeacher() ? "sinh viên" : "giảng viên"}
      </Typography.Title>
      {isMounted && isTeacher() ? <TeacherContent /> : <StudentContent />}
    </Layout.Content>
  );
}

function TeacherContent() {
  const user = useRecoilValue<Teacher | null>(userState);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedRowStatuses, setSelectedRowStatuses] = useState<any[]>([]);
  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: any) => ({
      disabled: user?.isImportedStudentListToSystem,
    }),
  };
  const teacherContentItems: TabsProps["items"] = [
    {
      key: "1",
      label: `Chờ xác nhận`,
      children: <OGTable config={receivedRequestListConfig} key={1} />,
    },
    {
      key: "2",
      label: `Đang thực hiện luận văn`,
      children: <OGTable config={studentListConfig} key={2} />,
    },
    {
      key: "3",
      label: `Danh sách báo cáo`,
      children: (
        <OGTable
          rowSelection={rowSelection}
          config={thesisDefenseStudentListConfig(
            handleSubmit,
            handleSetStatus,
            selectedRowKeys,
            user?.isImportedStudentListToSystem
          )}
          key={3}
          size="small"
        />
      ),
    },
  ];

  useEffect(() => {}, []);

  function onSelectChange(newSelectedRowKeys: React.Key[], selectedRows: any) {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(selectedRows);
  }

  function handleSetStatus(e: RadioChangeEvent, index: number) {
    if (selectedRowStatuses.find((row) => row.index === index)) {
      setSelectedRowStatuses((prev: any) => {
        prev[index] = { index, value: e.target.value };

        return prev;
      });
    } else
      setSelectedRowStatuses((prev: any) => {
        prev.push({ index, value: e.target.value });
        return prev;
      });
  }

  async function handleSubmit() {
    const clonedSelectedRows = cloneDeep(selectedRows);
    selectedRowStatuses.forEach(
      (row) =>
        selectedRowKeys.includes(row.index) &&
        (clonedSelectedRows[row.index] = {
          ...clonedSelectedRows[row.index],
          status: row.value,
        })
    );
    //Filter out incorrect data
    const filteredClonedSelectedRows = clonedSelectedRows.filter(
      (row) => row.MSSV
    );

    if (filteredClonedSelectedRows.length === 0)
      return message.error("Danh sách báo cáo trống.");
    if (!user) return;

    try {
      const studentList: StudentList = {
        MSCB: user.MSCB,
        teacherName: `${user.lastName} ${user.firstName}`,
        students: handleSeperateStudentList(
          filteredClonedSelectedRows,
          ThesisStatus.IsReadyForThesisDefense
        ),
        incompleteStudents: handleSeperateStudentList(
          filteredClonedSelectedRows,
          ThesisStatus.IsMarkedForIncomplete
        ),
      };
      await axios.post(
        baseURL +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.BASE +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.STUDENT_LIST.BASE +
          COMMON_ENDPOINT.IMPORT,
        { data: studentList }
      );

      setSelectedRowKeys([]);
      reloadProfileSubject.next(1);
      message.success("Nộp danh sách báo cáo thành công.");
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  function handleSeperateStudentList(list: Student[], status: ThesisStatus) {
    return list.filter((student) => student.status === status);
  }

  return (
    <Tabs
      items={teacherContentItems}
      className="p-5 bg-white rounded-md shadow-md"
      defaultActiveKey="2"
      destroyInactiveTabPane
    />
  );
}

function StudentContent() {
  return (
    <Tabs
      items={studentContentItems}
      className="p-5 bg-white rounded-md shadow-md"
      destroyInactiveTabPane
    />
  );
}

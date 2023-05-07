import { Button, Layout, Switch, Typography, message } from "antd";
import { AtomExportButton } from "../../components/atoms/button/export-button.atom";
import {
  COMMON_ENDPOINT,
  STUDENT_ENDPOINT,
  STUDENT_MANAGEMENT_ENDPOINT,
  THESIS_DEFENSE_SCHEDULE_ENDPOINT,
  baseURL,
} from "../../constants/endpoints";
import { TableConfig } from "../interface/table-config.interface";
import { AtomStudentManagementTableAction } from "../../components/atoms/action/student-management-table-action.atom";
import { MCAddUserFormModal } from "../../components/molecules/modal/add-user-form-modal.molecule";
import useSWR from "swr";
import axios from "axios";
import { useState } from "react";
import { ThesisStatus } from "../../constants/enums";
import { handleRenderStudentStatus } from "../../utils/format.util";
import dayjs from "dayjs";
import { slotsData } from "../../components/molecules/form/add-schedule-event-form.molecule";

export const studentManagementListConfig: TableConfig = {
  apiEndpoint: STUDENT_MANAGEMENT_ENDPOINT.BASE,
  title: "Quản lý sinh viên",
  search: true,
  filter: [
    {
      key: "status",
      label: "Trạng thái",
      data: [
        { label: "Tất cả", value: "" },
        { label: "Giảng viên chưa nộp danh sách", value: null },
        { label: "Nhận điểm I", value: ThesisStatus.IsMarkedForIncomplete },
        {
          label: "Chưa có lịch báo cáo",
          value: ThesisStatus.IsReadyForThesisDefense,
        },
        {
          label: "Đã có lịch báo cáo",
          value: ThesisStatus.IsHadThesisDefenseSchedule,
        },
      ],
    },
  ],
  extraRightComponent: [
    () => <GradingStatusSwitch />,
    (props) => (
      <MCAddUserFormModal
        title="Thêm sinh viên"
        endpoint={STUDENT_MANAGEMENT_ENDPOINT.BASE}
        triggerElement={(openModal) => (
          <Button onClick={openModal} type="primary">
            Thêm sinh viên
          </Button>
        )}
      />
    ),
  ],
  table: {
    pageSize: 7,
    columns: [
      {
        key: "MSSV",
        title: "MSSV",
        dataIndex: "MSSV",
        sorter: true,
      },
      {
        key: "name",
        title: "Họ và Tên",
        dataIndex: "firstName",
        sorter: true,

        render: (text, record: any) => (
          <span>
            {record.lastName} {record.firstName}
          </span>
        ),
      },
      {
        key: "email",
        title: "Email",
        dataIndex: "email",
        sorter: true,
      },
      {
        key: "major",
        title: "Chuyên ngành",
        dataIndex: "major",
        sorter: true,
      },
      {
        key: "status",
        title: "Trạng thái luận văn",
        dataIndex: "status",
        sorter: true,
        render: (value, record, index) => {
          return handleRenderStudentStatus(value);
        },
      },
      {
        key: "reportSchedule",
        title: "Lịch báo cáo",
        dataIndex: "reportSchedule",
        render: (value, record, index) => {
          return (
            <Typography.Text>
              {value
                ? `${
                    slotsData.find((s) => s.value == value.title)?.name ?? ""
                  }/ ${dayjs(value.start).format("LL")}`
                : "Chưa có"}
            </Typography.Text>
          );
        },
      },
      {
        key: "action",
        width: "10%",
        title: "Hành động",
        render: (text, student: any) => (
          <AtomStudentManagementTableAction student={student} />
        ),
      },
    ],
  },
};

function GradingStatusSwitch() {
  const [loading, setLoading] = useState(false);
  const { data: status, mutate } = useSWR(
    baseURL +
      THESIS_DEFENSE_SCHEDULE_ENDPOINT.BASE +
      THESIS_DEFENSE_SCHEDULE_ENDPOINT.GRADING_STATUS,
    async (url) => (await axios.get(url)).data.data
  );

  async function handleToggleGradingStatus(checked: boolean) {
    setLoading(true);
    try {
      await axios.put(
        baseURL +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.BASE +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.GRADING_STATUS,
        { status: checked }
      );

      message.success(`${checked ? "Mở khóa" : "Khóa"} nhập điểm thành công`);
    } catch (error: any) {
      message.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
      mutate();
    }
  }

  if (status === undefined) return null;

  return (
    <Layout.Content className="w-full space-x-2 flex items-center justify-end">
      <Typography.Text>Trạng thái nhập điểm</Typography.Text>
      <Switch
        disabled={loading}
        defaultChecked={status}
        onChange={handleToggleGradingStatus}
      />
    </Layout.Content>
  );
}

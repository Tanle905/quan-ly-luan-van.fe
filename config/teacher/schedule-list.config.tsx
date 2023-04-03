import { Dropdown, Form, Input, Modal, Tag, Typography } from "antd";
import { STUDENT_ENDPOINT, baseURL } from "../../constants/endpoints";
import { TableConfig } from "../interface/table-config.interface";
import { ThesisStatus } from "../../constants/enums";
import { MoreOutlined } from "@ant-design/icons";
import { useState } from "react";
import axios from "axios";

export const scheduleListConfig: (status: any) => TableConfig = (status) => ({
  apiEndpoint: STUDENT_ENDPOINT.BASE,
  title: "Quản lý danh sách sinh viên báo cáo luận văn",
  search: true,
  extraRightComponent: [
    () => (
      <Typography.Text>
        <Typography.Text strong>Trạng thái:</Typography.Text>{" "}
        {status ? "Cho" : "Không cho"} chỉnh sửa điểm
      </Typography.Text>
    ),
  ],
  query: `?status=${ThesisStatus.IsReadyForThesisDefense}`,
  table: {
    columns: [
      {
        key: "MSSV",
        title: "MSSV",
        dataIndex: "MSSV",
        width: "7%",
        sorter: true,
      },
      {
        key: "name",
        title: "Họ và Tên",
        dataIndex: "firstName",
        sorter: true,
        width: "15%",
        render: (text: any, record: any) => (
          <span>
            {record.lastName} {record.firstName}
          </span>
        ),
      },
      {
        key: "email",
        title: "Email",
        dataIndex: "email",
        ellipsis: true,
        sorter: true,
      },
      {
        key: "major",
        title: "Chuyên ngành",
        dataIndex: "major",
        width: "10%",
        sorter: true,
      },
      {
        key: "topicName",
        title: "Tên đề tài",
        dataIndex: "topic",
        width: "10%",
        ellipsis: true,
        sorter: true,
        render: (value: { topicName: any }, record: any, index: any) => {
          return value.topicName;
        },
      },
      {
        key: "majorTag",
        title: "Chủ đề đề tài",
        dataIndex: "topic",
        width: "10%",
        render: (value: { majorTag: any }, record: any, index: any) => {
          return <Tag>{value.majorTag}</Tag>;
        },
      },
      {
        key: "grade",
        title: "Điểm luận văn",
        dataIndex: "grade",
        render: (value: any, record: any) => (
          <Typography.Text>
            {value ? `${value} điểm` : "Chưa có"}
          </Typography.Text>
        ),
      },
      {
        key: "action",
        title: "Hành động",
        render: (value: any, record: any) => (
          <ScheduleDropdown student={record} status={status} />
        ),
      },
    ],
  },
});

function ScheduleDropdown({ student, status }: any) {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  async function handleSubmitGrade() {
    if (!form.getFieldsValue()?.grade) return;

    await axios.put(`${baseURL}${STUDENT_ENDPOINT.BASE}/${student.MSSV}`, {
      grade: form.getFieldsValue().grade,
    });
    setOpen(false);
    form.resetFields();
  }

  return (
    <>
      <Modal
        destroyOnClose
        title={`Nhập điểm báo cáo luận văn ${student.MSSV}`}
        open={open}
        closable
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        onOk={handleSubmitGrade}
      >
        <Form form={form}>
          <Form.Item name="grade" label="Điểm luận văn">
            <Input type="number" min={0} max={10} />
          </Form.Item>
        </Form>
      </Modal>
      <Dropdown
        menu={{
          items: [
            {
              key: 1,
              label: "Nhập điểm",
              onClick: () => setOpen(true),
              disabled: !status,
            },
          ],
        }}
      >
        <MoreOutlined className="cursor-pointer p-2 hover:bg-indigo-600 hover:text-white rounded-md transition-all" />
      </Dropdown>
    </>
  );
}

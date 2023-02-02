import {
  MailOutlined,
  NumberOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Form, Input, Layout } from "antd";
import { useEffect } from "react";
import { Roles } from "../../../constants/enums";
import { User } from "../../../interfaces/user.interface";

interface MCProfileFormProps {
  profile: User | null | undefined;
}

export function MCProfileForm({ profile }: MCProfileFormProps) {
  const [form] = Form.useForm();
  const isStudent = profile?.roles?.includes(Roles.STUDENT);

  useEffect(() => {
    form.setFieldsValue({
      ...profile,
      roles: isStudent ? "Sinh viên" : "Giảng viên",
    });
  }, [profile]);

  if (!profile) return null;

  return (
    <Layout.Content className="rounded-md shadow-md bg-white p-5">
      <Form form={form} className="space-y-5">
        <div className="flex items-center">
          <span className="w-52">{isStudent ? "MSSV: " : "MSCB: "}</span>
          <Form.Item
            className="inline-block w-96"
            name={isStudent ? "MSSV" : "MSCB"}
            style={{ marginBottom: 0 }}
          >
            <Input type="text" disabled prefix={<NumberOutlined />} />
          </Form.Item>
        </div>
        <div className="flex items-center">
          <span className="w-52">Họ và tên: </span>
          <div className="flex items-center space-x-5">
            <Form.Item
              name={"lastName"}
              className="inline-block w-[11.4rem]"
              style={{ marginBottom: 0 }}
            >
              <Input type="text" disabled prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              name={"firstName"}
              className="inline-block w-[11.4rem]"
              style={{ marginBottom: 0 }}
            >
              <Input type="text" disabled />
            </Form.Item>
          </div>
        </div>
        <div className="flex items-center">
          <span className="w-52">Số điện thoại: </span>
          <Form.Item
            name={"phoneNumber"}
            className="inline-block w-96"
            style={{ marginBottom: 0 }}
          >
            <Input type="number" disabled prefix={<PhoneOutlined />} />
          </Form.Item>
        </div>
        <div className="flex items-center">
          <span className="w-52">Địa chỉ Email: </span>
          <Form.Item
            name={"email"}
            className="inline-block w-96"
            style={{ marginBottom: 0 }}
          >
            <Input type="text" disabled prefix={<MailOutlined />} />
          </Form.Item>
        </div>
        <div className="flex items-center">
          <span className="w-52">Chức vụ: </span>
          <Form.Item
            name={"roles"}
            className="inline-block w-96"
            style={{ marginBottom: 0 }}
          >
            <Input type="text" disabled />
          </Form.Item>
        </div>
        <div className="flex items-center">
          <span className="w-52">Chuyên ngành: </span>
          <Form.Item
            name={"major"}
            className="inline-block w-96"
            style={{ marginBottom: 0 }}
          >
            <Input type="text" disabled />
          </Form.Item>
        </div>
        {isStudent && (
          <div className="flex items-center">
            <span className="w-52">Lớp: </span>
            <Form.Item
              name={"class"}
              className="inline-block w-96"
              style={{ marginBottom: 0 }}
            >
              <Input type="text" disabled />
            </Form.Item>
          </div>
        )}
        <div className="flex items-center">
          <span className="w-52">Trường: </span>
          <Form.Item
            name={"department"}
            className="inline-block w-96"
            style={{ marginBottom: 0 }}
          >
            <Input type="text" disabled />
          </Form.Item>
        </div>
        <div className="flex items-center">
          <span className="w-52">Dân tộc: </span>
          <Form.Item
            name={"ethnic"}
            className="inline-block w-96"
            style={{ marginBottom: 0 }}
          >
            <Input type="text" disabled />
          </Form.Item>
        </div>
        <div className="flex items-center">
          <span className="w-52">Tôn giáo: </span>
          <Form.Item
            name={"religion"}
            className="inline-block w-96"
            style={{ marginBottom: 0 }}
          >
            <Input type="text" disabled />
          </Form.Item>
        </div>
        <div className="flex items-center">
          <span className="w-52">CCCD: </span>
          <Form.Item
            name={"CCCD"}
            className="inline-block w-96"
            style={{ marginBottom: 0 }}
          >
            <Input type="text" disabled />
          </Form.Item>
        </div>
      </Form>
    </Layout.Content>
  );
}

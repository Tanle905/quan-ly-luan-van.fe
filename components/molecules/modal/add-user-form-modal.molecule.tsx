import {
  NumberOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  SecurityScanOutlined,
} from "@ant-design/icons";
import {
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Typography,
  message,
} from "antd";
import axios from "axios";
import { useState, useEffect, ReactNode } from "react";
import { baseURL } from "../../../constants/endpoints";
import { Roles } from "../../../constants/enums";
import { User } from "../../../interfaces/user.interface";
import { reloadTableSubject } from "../../../constants/observables";

interface MCAddUserFormModalProps {
  title: string;
  role?: Roles;
  endpoint: string;
  data?: User;
  triggerElement: (openModal: any) => ReactNode;
}

interface MCAddInfoFormProps {
  profile: User | null | undefined;
  role?: Roles;
  form: FormInstance;
}

export function MCAddUserFormModal({
  triggerElement,
  title,
  role,
  endpoint,
  data,
}: MCAddUserFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();

  function handleOpenModal() {
    setIsOpen(true);
  }

  function handleCloseModal() {
    setIsOpen(false);
    form.resetFields();
  }

  async function handleAddUser() {
    const payload = Object.fromEntries(
      Object.entries(form.getFieldsValue()).filter((value) => value[1])
    );

    try {
      await form.validateFields();
      await axios.put(baseURL + endpoint, payload);

      message.success("Lưu thành công");
      handleCloseModal();
      reloadTableSubject.next(1);
    } catch (error: any) {
      message.error(error?.response?.data?.message || error?.message);
    }
  }

  return (
    <>
      <Modal
        destroyOnClose
        title={title}
        open={isOpen}
        closable
        onCancel={handleCloseModal}
        width={650}
        onOk={handleAddUser}
      >
        <MCAddInfoForm
          form={form}
          profile={data ?? null}
          role={role ?? Roles.STUDENT}
        />
      </Modal>
      {triggerElement(handleOpenModal)}
    </>
  );
}

function MCAddInfoForm({ form, profile, role }: MCAddInfoFormProps) {
  const isStudent = role === Roles.STUDENT;

  useEffect(() => {
    form.setFieldsValue(profile);
  }, [profile]);

  return (
    <Form form={form} className="space-y-3">
      <div className="flex items-center">
        <span className="w-52">Tên đăng nhập: </span>
        <Form.Item
          name={"username"}
          className="inline-block w-96"
          style={{ marginBottom: 0 }}
          rules={[
            { required: true, message: "Vui lòng nhập tên đăng nhập" },
            { max: 50, message: "Vui lòng nhập không quá 50 ký tự" },
          ]}
        >
          <Input type="text" />
        </Form.Item>
      </div>
      <div className="flex items-center">
        <span className="w-52">Mật khẩu: </span>
        <div className="flex items-center space-x-5">
          <Form.Item
            name={"password"}
            className="inline-block w-96"
            style={{ marginBottom: 0 }}
          >
            <Input
              type="text"
              prefix={<SecurityScanOutlined />}
              suffix={
                <Typography.Text
                  className="cursor-pointer"
                  onClick={() =>
                    form.setFieldValue(
                      "password",
                      Math.random().toString(36).slice(-8)
                    )
                  }
                >
                  Tự động tạo
                </Typography.Text>
              }
            />
          </Form.Item>
        </div>
      </div>
      {role === Roles.STUDENT && (
        <div className="flex items-center">
          <span className="w-52">Điểm số: </span>
          <Form.Item
            name={"grade"}
            className="inline-block w-96"
            style={{ marginBottom: 0 }}
          >
            <InputNumber
              type="number"
              className="w-full"
              min={0}
              max={10}
              prefix="điểm"
            />
          </Form.Item>
        </div>
      )}
      <div className="flex items-center">
        <div className="w-52">
          <span className="text-end">{isStudent ? "MSSV: " : "MSCB: "}</span>
        </div>
        <Form.Item
          className="inline-block w-96"
          name={isStudent ? "MSSV" : "MSCB"}
          style={{ marginBottom: 0 }}
          rules={[
            {
              required: true,
              message: `Vui lòng nhập ${isStudent ? "MSSV" : "MSCB"}`,
            },
            { max: 20, message: "Vui lòng nhập không quá 20 ký tự" },
          ]}
        >
          <Input type="text" prefix={<NumberOutlined />} />
        </Form.Item>
      </div>
      <div className="flex items-center">
        <span className="w-52">Họ và tên: </span>
        <div className="flex items-center space-x-5">
          <Form.Item
            name={"lastName"}
            className="inline-block w-[11.4rem]"
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
                message: `Vui lòng nhập họ và tên đệm`,
              },
              { max: 20, message: "Vui lòng nhập không quá 20 ký tự" },
            ]}
          >
            <Input type="text" prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            name={"firstName"}
            className="inline-block w-[11.4rem]"
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
                message: `Vui lòng nhập tên`,
              },
              { max: 20, message: "Vui lòng nhập không quá 20 ký tự" },
            ]}
          >
            <Input type="text" />
          </Form.Item>
        </div>
      </div>
      <div className="flex items-center">
        <span className="w-52">Số điện thoại: </span>
        <Form.Item
          name={"phoneNumber"}
          className="inline-block w-96"
          style={{ marginBottom: 0 }}
          rules={[
            {
              required: true,
              message: `Vui lòng nhập số điện thoại liên hệ`,
            },
            {
              pattern: new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
              message: "Vui lòng nhập số điện thoại hợp lệ",
            },
          ]}
        >
          <Input type="number" prefix={<PhoneOutlined />} />
        </Form.Item>
      </div>
      <div className="flex items-center">
        <span className="w-52">Địa chỉ Email: </span>
        <Form.Item
          name={"email"}
          className="inline-block w-96"
          style={{ marginBottom: 0 }}
          rules={[
            {
              required: true,
              message: `Vui lòng nhập địa chỉ email`,
            },
            {
              pattern: new RegExp(/^\S+@\S+\.\S+$/),
              message: "Vui lòng nhập địa chỉ email hợp lệ",
            },
          ]}
        >
          <Input type="text" prefix={<MailOutlined />} />
        </Form.Item>
      </div>
      <div className="flex items-center">
        <span className="w-52">Chuyên ngành: </span>
        <Form.Item
          name={"major"}
          className="inline-block w-96"
          style={{ marginBottom: 0 }}
        >
          <Input type="text" />
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
            <Input type="text" />
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
          <Input type="text" />
        </Form.Item>
      </div>
      <div className="flex items-center">
        <span className="w-52">Dân tộc: </span>
        <Form.Item
          name={"ethnic"}
          className="inline-block w-96"
          style={{ marginBottom: 0 }}
        >
          <Input type="text" />
        </Form.Item>
      </div>
      <div className="flex items-center">
        <span className="w-52">Tôn giáo: </span>
        <Form.Item
          name={"religion"}
          className="inline-block w-96"
          style={{ marginBottom: 0 }}
        >
          <Input type="text" />
        </Form.Item>
      </div>
      <div className="flex items-center">
        <span className="w-52">CCCD: </span>
        <Form.Item
          name={"CCCD"}
          className="inline-block w-96"
          style={{ marginBottom: 0 }}
        >
          <Input type="number" />
        </Form.Item>
      </div>
    </Form>
  );
}

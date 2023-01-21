import { Form, Input, Layout } from "antd";
import { useForm } from "antd/es/form/Form";
import { useRecoilState, useRecoilValue } from "recoil";
import { Roles } from "../../../constants/enums";
import { User } from "../../../interfaces/user.interface";
import { userState } from "../../../stores/auth.store";

interface MCProfileFormProps {}

export function MCProfileForm({}: MCProfileFormProps) {
  const user: User = useRecoilValue(userState);
  const [form] = useForm();

  if (!user) return null;

  return (
    <Layout.Content className="p-5">
      <Form initialValues={user} form={form}>
        <Form.Item
          label="MSSV"
          name={user.roles?.includes(Roles.STUDENT) ? "MSSV" : "MSCB"}
        >
          <Input type="text" disabled />
        </Form.Item>{" "}
        <Form.Item label="Họ và tên" name={"name"}>
          <Input type="text" disabled />
        </Form.Item>
        <Form.Item label="Địa chỉ email" name={"email"}>
          <Input type="text" disabled />
        </Form.Item>
      </Form>
    </Layout.Content>
  );
}

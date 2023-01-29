import { Form, Input, Layout } from "antd";
import { useRecoilValue } from "recoil";
import { Roles } from "../../../constants/enums";
import { User } from "../../../interfaces/user.interface";
import { userState } from "../../../stores/auth.store";

interface MCProfileFormProps {}

export function MCProfileForm({}: MCProfileFormProps) {
  const user = useRecoilValue<User | null>(userState);
  const [form] = Form.useForm();

  if (!user) return null;

  return (
    <Layout.Content className="p-5">
      <Form initialValues={user} form={form}>
        <Form.Item
          label="MSSV"
          name={user.roles?.includes(Roles.STUDENT) ? "MSSV" : "MSCB"}
        >
          <Input type="text" disabled />
        </Form.Item>
        <Layout.Content className="flex justify-end space-x-5">
        <Form.Item label="Họ" name={"lastName"}>
          <Input type="text" disabled />
        </Form.Item>
        <Form.Item label="Tên" name={"firstName"}>
          <Input type="text" disabled />
        </Form.Item>
        </Layout.Content>
        <Form.Item label="Địa chỉ email" name={"email"}>
          <Input type="text" disabled />
        </Form.Item>
      </Form>
    </Layout.Content>
  );
}

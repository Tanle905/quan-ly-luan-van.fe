import {
  Button,
  Checkbox,
  Col,
  Form,
  FormInstance,
  Input,
  Layout,
  message,
  Row,
  Typography,
} from "antd";
import { useState } from "react";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import axios from "axios";
import { useRouter } from "next/router";
import { baseUrl, AUTH_ENDPOINT } from "../../../constants/endpoints";
import { LOCAL_STORAGE } from "../../../constants/local_storage_key";
import { SCREEN_ROUTE } from "../../../constants/screen-route";
import { handleValidateOnFieldChange } from "../../../utils/validation.util";

export function OGLoginContent() {
  const router = useRouter();
  const { Content } = Layout;
  const { Paragraph, Title, Link } = Typography;
  const [loginForm] = Form.useForm();
  const [msg, contextHolder] = message.useMessage();
  const [isLoginFormValid, setIsLoginFormValid] = useState(false);
  const [isRememberPassword, setIsRememberPassword] = useState(false);

  function onCheckRememberPassword(event: CheckboxChangeEvent) {
    setIsRememberPassword(event.target.checked);
  }

  async function handleLogin(form: FormInstance) {
    try {
      const { data } = await axios.post(
        baseUrl + AUTH_ENDPOINT.BASE + AUTH_ENDPOINT.LOGIN,
        form.getFieldsValue()
      );
      localStorage.setItem(LOCAL_STORAGE.USER_DATA, JSON.stringify(data));
      router.push(SCREEN_ROUTE.BASE);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  return (
    <>
      {contextHolder}
      <main className="h-screen grid grid-cols-2">
        <Content className="col-span-1 flex justify-center items-center w-full">
          <Content className="m-auto w-4/6">
            <Title>Chào Mừng</Title>
            <Paragraph className="text-gray-600 font-semibold">
              Vui lòng đăng nhập để tiếp tục sử dụng
            </Paragraph>
            <Form
              onFieldsChange={() =>
                handleValidateOnFieldChange(loginForm, setIsLoginFormValid)
              }
              layout="vertical"
              onFinish={() => handleLogin(loginForm)}
              form={loginForm}
            >
              <Form.Item
                name={"username"}
                label={"Tài khoản"}
                rules={[{ required: true, max: 50 }]}
                className="font-semibold text-gray-600"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={"password"}
                label={"Mật khẩu"}
                rules={[{ required: true, max: 32 }]}
                className="font-semibold text-gray-600"
              >
                <Input type="password" />
              </Form.Item>
              <Row className="flex justify-between">
                <Col>
                  <Content className="flex space-x-1">
                    <Checkbox
                      name="rememberPassword"
                      onChange={onCheckRememberPassword}
                    />
                    <Paragraph className="font-semibold m-0 text-gray-700">
                      Nhớ mật khẩu
                    </Paragraph>
                  </Content>
                </Col>
                <Col>
                  <Link className="text-indigo-600">Quên mật khẩu?</Link>
                </Col>
              </Row>
              <Button
                disabled={!isLoginFormValid}
                type="primary"
                htmlType="submit"
                style={{ height: 40 }}
                className="w-full"
              >
                Đăng nhập
              </Button>
            </Form>
          </Content>
        </Content>
        <Content className="col-span-1 bg-gray-100">sdfsdf</Content>
      </main>
    </>
  );
}
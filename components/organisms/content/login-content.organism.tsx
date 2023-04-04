import { Form, FormInstance, Input, Layout, message, Typography } from "antd";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { AUTH_ENDPOINT } from "../../../constants/endpoints";
import { LOCAL_STORAGE } from "../../../constants/local_storage_key";
import { SCREEN_ROUTE } from "../../../constants/screen-route";
import { handleValidateOnFieldChange } from "../../../utils/validation.util";
import { AtomLoadingButton } from "../../atoms/button/loading-button.atom";
import Image from "next/image";

export function OGLoginContent() {
  const router = useRouter();
  const { Content } = Layout;
  const { Paragraph, Title, Link } = Typography;
  const [loginForm] = Form.useForm();
  const [isLoginFormValid, setIsLoginFormValid] = useState(false);

  async function handleLogin(form: FormInstance) {
    try {
      const { data } = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL +
          AUTH_ENDPOINT.BASE +
          AUTH_ENDPOINT.LOGIN,
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
      <div className="h-screen grid grid-cols-2">
        <Content className="col-span-1 flex justify-center items-center w-full">
          <Content className="m-auto w-4/6">
            <Title>Chào Mừng</Title>
            <Paragraph className="text-gray-600 font-semibold">
              Vui lòng đăng nhập để tiếp tục sử dụng
            </Paragraph>
            <Form
              onFieldsChange={() =>
                setIsLoginFormValid(handleValidateOnFieldChange(loginForm))
              }
              layout="vertical"
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
              <AtomLoadingButton
                disabled={!isLoginFormValid}
                onClick={() => handleLogin(loginForm)}
                buttonProps={{
                  type: "primary",
                  htmlType: "submit",
                  style: { height: 40 },
                  className: "w-full",
                }}
              >
                Đăng nhập
              </AtomLoadingButton>
            </Form>
          </Content>
        </Content>
        <Content className="col-span-1 bg-gray-100 flex items-center shadow-2xl">
          <Image
            alt=""
            src="/images/login.svg"
            className="w-full"
            width={500}
            height={500}
          />
        </Content>
      </div>
    </>
  );
}

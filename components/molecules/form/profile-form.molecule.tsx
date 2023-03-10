import {
  MailOutlined,
  NumberOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Divider,
  Form,
  Input,
  Layout,
  message,
  Select,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { PROFILE_ENDPOINT, TAG_ENDPOINT } from "../../../constants/endpoints";
import { Roles } from "../../../constants/enums";
import { User } from "../../../interfaces/user.interface";
import { isTeacher } from "../../../utils/role.util";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import axios from "axios";
import { AtomLoadingButton } from "../../atoms/button/loading-button.atom";
import { TagDetails } from "../../../interfaces/tag.interface";
import { cloneDeep } from "lodash";

interface MCProfileFormProps {
  readOnly?: boolean;
  profile: User | null | undefined;
}

export function MajorTag({ label, value, closable, onClose }: CustomTagProps) {
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
}

export function MCProfileForm({ profile, readOnly }: MCProfileFormProps) {
  const [form] = Form.useForm();
  const [mounted, setMounted] = useState(false);
  const [options, setOptions] = useState([]);
  const [roles, setRoles] = useState<string | undefined>("");
  const isStudent = roles === Roles.STUDENT;
  const { data } = useSWR(
    mounted &&
      isTeacher() &&
      process.env.NEXT_PUBLIC_BASE_URL +
        TAG_ENDPOINT.BASE +
        TAG_ENDPOINT.MAJOR_TAGS,
    tagsFetcher
  );
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!data) return;

    const mappedData = data.map((tag: TagDetails) => {
      return { value: tag.value, color: tag.color };
    });

    setOptions(mappedData);
  }, [data]);

  useEffect(() => {
    if (!profile?.roles) return;

    let roles = "";

    switch (profile.roles[0]) {
      case Roles.STUDENT:
        roles = "Sinh vi??n";
        break;
      case Roles.TEACHER:
        roles = "Gi???ng vi??n";
        break;
      case Roles.ADMIN:
        roles = "Qu???n tr??? vi??n";
        break;

      default:
        break;
    }

    form.setFieldsValue({
      ...profile,
      roles,
    });
    setRoles(profile?.roles[0]);
  }, [profile]);

  async function tagsFetcher() {
    const { data } = await axios.get(
      process.env.NEXT_PUBLIC_BASE_URL +
        TAG_ENDPOINT.BASE +
        TAG_ENDPOINT.MAJOR_TAGS
    );

    return data.data;
  }

  async function handleSaveProfile() {
    const formData = form.getFieldsValue();
    delete formData.roles;

    try {
      await axios.put(
        process.env.NEXT_PUBLIC_BASE_URL + PROFILE_ENDPOINT.BASE,
        formData
      );

      message.success("L??u h??? s?? th??nh c??ng");
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  function handleResetForm() {
    const clonedProfile = cloneDeep(profile) as any;
    if (clonedProfile) delete clonedProfile.roles;

    form.setFieldsValue({
      ...clonedProfile,
    });
  }

  if (!profile) return null;

  return (
    <>
      <Layout.Content className="rounded-md shadow-md bg-white p-5 space-y-5">
        {!readOnly && (
          <>
            <Layout.Content className="flex justify-end space-x-2 px-5">
              <Button
                type="ghost"
                onClick={handleResetForm}
                className="text-white bg-red-600 hover:bg-red-500 transition-all disabled:bg-gray-100 disabled:text-gray-400"
              >
                ?????t l???i
              </Button>
              <AtomLoadingButton
                onClick={handleSaveProfile}
                buttonProps={{ type: "primary" }}
              >
                L??u thay ?????i
              </AtomLoadingButton>
            </Layout.Content>
            <Divider className="m-0" />
          </>
        )}
        <Form form={form} className="space-y-3">
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
            <span className="w-52">H??? v?? t??n: </span>
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
            <span className="w-52">S??? ??i???n tho???i: </span>
            <Form.Item
              name={"phoneNumber"}
              className="inline-block w-96"
              style={{ marginBottom: 0 }}
            >
              <Input type="number" disabled prefix={<PhoneOutlined />} />
            </Form.Item>
          </div>
          <div className="flex items-center">
            <span className="w-52">?????a ch??? Email: </span>
            <Form.Item
              name={"email"}
              className="inline-block w-96"
              style={{ marginBottom: 0 }}
            >
              <Input type="text" disabled prefix={<MailOutlined />} />
            </Form.Item>
          </div>
          {!isStudent && (
            <div className="flex items-center">
              <span className="w-52">Tags: </span>
              <Form.Item
                name={"majorTags"}
                className="inline-block w-96"
                style={{ marginBottom: 0 }}
              >
                <Select
                  disabled={readOnly}
                  tagRender={MajorTag}
                  options={options}
                  mode="multiple"
                  showArrow
                />
              </Form.Item>
            </div>
          )}
          <div className="flex items-center">
            <span className="w-52">Ch???c v???: </span>
            <Form.Item
              name={"roles"}
              className="inline-block w-96"
              style={{ marginBottom: 0 }}
            >
              <Input type="text" disabled />
            </Form.Item>
          </div>
          <div className="flex items-center">
            <span className="w-52">Chuy??n ng??nh: </span>
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
              <span className="w-52">L???p: </span>
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
            <span className="w-52">Tr?????ng: </span>
            <Form.Item
              name={"department"}
              className="inline-block w-96"
              style={{ marginBottom: 0 }}
            >
              <Input type="text" disabled />
            </Form.Item>
          </div>
          <div className="flex items-center">
            <span className="w-52">D??n t???c: </span>
            <Form.Item
              name={"ethnic"}
              className="inline-block w-96"
              style={{ marginBottom: 0 }}
            >
              <Input type="text" disabled />
            </Form.Item>
          </div>
          <div className="flex items-center">
            <span className="w-52">T??n gi??o: </span>
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
    </>
  );
}

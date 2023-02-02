import {
  Button,
  Divider,
  Form,
  Input,
  Layout,
  message,
  StepProps,
  Steps,
  StepsProps,
  Typography,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import useSWR from "swr";
import { TOPIC_ENDPOINT } from "../../../constants/endpoints";
import { TopicStatus } from "../../../constants/enums";
import { Topic } from "../../../interfaces/topic.interface";
import { userState } from "../../../stores/auth.store";
import { isStudent, isTeacher } from "../../../utils/role.util";
import { clearCache } from "../../../utils/swr.util";
import { handleValidateOnFieldChange } from "../../../utils/validation.util";
import { AtomLoadingButton } from "../../atoms/button/loading-button.atom";

const { Content } = Layout;
const { Title } = Typography;
const { Item } = Form;
const { TextArea } = Input;

interface MCTopicFormProps {
  MSSV?: string;
  topic: any;
  setTopic: any;
}

export function MCTopicForm({ MSSV, topic, setTopic }: MCTopicFormProps) {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useRecoilState<any>(userState);
  const [form] = Form.useForm();
  const [msg, contextHolder] = message.useMessage();
  const [isValid, setIsValid] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const isTopicExist = topic ? true : false;
  const { data, mutate, isValidating } = useSWR(
    isTeacher() && mounted && TOPIC_ENDPOINT.BASE,
    topicFetcher
  );
  let steps: StepsProps["items"] = [
    { title: "Tạo chủ đề" },
    { title: "Chờ duyệt" },
    { title: "Đã duyệt", status: "finish" },
  ];

  useEffect(() => {
    setMounted(true);

    return () => {
      clearCache(mutate);
    };
  }, []);

  useEffect(() => {
    if (!data) return;

    setTopic(data);
  }, [data]);

  useEffect(() => {
    if (!user) return;

    if (user?.sentTopic) setTopic(user.sentTopic);
  }, [user]);

  useEffect(
    () =>
      form.setFieldsValue({
        topicName: topic?.topicName,
        topicDescription: topic?.topicDescription,
      }),
    [topic]
  );

  async function topicFetcher() {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}${TOPIC_ENDPOINT.BASE}?MSSV=${MSSV}&MSCB=${user.MSCB}`
    );
    return res.data.data;
  }

  async function handleSendTopic() {
    if (!user) return;

    const topicDescription = form.getFieldValue("topicDescription");
    const topicName = form.getFieldValue("topicName");
    try {
      const res = await axios.post<any, any, Topic>(
        process.env.NEXT_PUBLIC_BASE_URL + TOPIC_ENDPOINT.BASE,
        {
          MSSV: user.MSSV,
          MSCB: user.teacher?.MSCB as string,
          studentName: `${user.lastName} ${user.firstName}`,
          topicDescription,
          topicName,
        }
      );

      message.success("Gửi chủ đề thành công !");
      setUser((prevUser: any) => {
        return { ...prevUser, sentTopic: res.data.data };
      });
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setIsValid(false);
      setCanEdit(false);
    }
  }

  async function handleRequestChangeTopic() {
    if (!topic) return;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}${TOPIC_ENDPOINT.BASE}/${topic._id}`
      );

      message.success("Yêu cầu chỉnh sửa thành công !");
      mutate();
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  async function handleAcceptTopic() {
    if (!topic) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}${TOPIC_ENDPOINT.BASE}/${topic._id}`
      );

      message.success("Chấp nhận chủ đề thành công !");
      mutate();
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  function calculateSteps() {
    if (!topic) {
      return 0;
    }

    const errorStep: StepProps = {
      title: "Yêu câu chỉnh sửa",
      status: "error",
    };

    switch (topic.topicStatus) {
      case TopicStatus.Pending:
        return 1;
      case TopicStatus.RequestChange:
        if (steps) {
          steps[1] = errorStep;
        }
        return 1;
      case TopicStatus.Accepted:
        return 2;
      default:
        return 0;
    }
  }

  function handleResetField() {
    form.resetFields();
    setIsValid(false);
  }

  if(!mounted) return null;

  return (
    <>
      {contextHolder}
      <Content>
        <Title level={4} style={{ marginTop: 0 }}>
          Chủ đề luận văn
        </Title>
        <Form
          form={form}
          className="space-y-5"
          onFieldsChange={() => setIsValid(handleValidateOnFieldChange(form))}
        >
          <Content className="flex items-center">
            <span className="w-20">Trạng thái: </span>
            <Steps items={steps} current={calculateSteps()} className="w-1/2" />
          </Content>
          <Content className="flex items-center">
            <span className="w-20">Tên đề tài: </span>
            <Item
              className="w-1/4"
              name="topicName"
              style={{ marginBottom: 0 }}
              rules={[{ required: true, max: 100 }]}
            >
              <Input
                type="text"
                disabled={isTeacher() || (isTopicExist && !canEdit)}
              />
            </Item>
          </Content>
          <Content className="flex items-center">
            <span className="w-20">Nội dung: </span>
            <Item
              className="w-1/2"
              name="topicDescription"
              style={{ marginBottom: 0 }}
              rules={[{ required: true, max: 300 }]}
            >
              <TextArea
                rows={4}
                disabled={isTeacher() || (isTopicExist && !canEdit)}
              />
            </Item>
          </Content>
        </Form>
        <>
          {isStudent() && !(topic?.topicStatus === TopicStatus.Accepted) && (
            <>
              <Divider />
              <Content className="flex justify-end space-x-2">
                {user?.sentTopic && (
                  <Button onClick={() => setCanEdit(true)} type="dashed">
                    Chỉnh sửa chủ đề
                  </Button>
                )}
                <Button
                  disabled={isTopicExist && !canEdit}
                  onClick={handleResetField}
                  type="ghost"
                  className="text-white bg-red-600 hover:bg-red-500 transition-all disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Đặt lại
                </Button>
                <AtomLoadingButton
                  disabled={!isValid}
                  onClick={handleSendTopic}
                  buttonProps={{ type: "primary" }}
                >
                  Gửi đề tài
                </AtomLoadingButton>
              </Content>
            </>
          )}
        </>
        <>
          {isTeacher() && !(topic?.topicStatus === TopicStatus.Accepted) && (
            <>
              <Divider />
              <Content className="flex justify-end space-x-2">
                <AtomLoadingButton
                  disabled={
                    topic?.topicStatus === TopicStatus.RequestChange ||
                    (!isTopicExist && !canEdit)
                  }
                  onClick={handleRequestChangeTopic}
                  buttonProps={{
                    type: "ghost",
                    className:
                      "text-white bg-red-600 hover:bg-red-500 transition-all disabled:bg-gray-100 disabled:text-gray-400",
                  }}
                >
                  Yêu cầu chỉnh sửa
                </AtomLoadingButton>
                <AtomLoadingButton
                  disabled={!isTopicExist}
                  onClick={handleAcceptTopic}
                  buttonProps={{ type: "primary" }}
                >
                  Duyệt đề tài
                </AtomLoadingButton>
              </Content>
            </>
          )}
        </>
      </Content>
    </>
  );
}

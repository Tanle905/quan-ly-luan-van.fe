import {
  Button,
  Divider,
  Form,
  Input,
  Layout,
  message,
  Modal,
  Select,
  StepProps,
  Steps,
  StepsProps,
  Typography,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { MouseEventHandler, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import {
  baseURL,
  TAG_ENDPOINT,
  TOPIC_ENDPOINT,
} from "../../../constants/endpoints";
import { TopicStatus } from "../../../constants/enums";
import { Student } from "../../../interfaces/student.interface";
import { TagDetails } from "../../../interfaces/tag.interface";
import { Teacher } from "../../../interfaces/teacher.interface";
import { Topic } from "../../../interfaces/topic.interface";
import { userState } from "../../../stores/auth.store";
import { isStudent, isTeacher } from "../../../utils/role.util";
import { clearCache } from "../../../utils/swr.util";
import { handleValidateOnFieldChange } from "../../../utils/validation.util";
import { AtomLoadingButton } from "../../atoms/button/loading-button.atom";
import { MajorTag } from "./profile-form.molecule";

const { Content } = Layout;
const { Title } = Typography;
const { Item } = Form;
const { TextArea } = Input;

interface MCTopicFormProps {
  topicId: string | undefined;
  topic: any;
  setTopic: any;
}

export function MCTopicForm({ topicId, topic, setTopic }: MCTopicFormProps) {
  const [mounted, setMounted] = useState(false);
  const user = useRecoilValue<(Student & Teacher) | null>(userState);
  const [form] = Form.useForm();
  const [isValid, setIsValid] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [options, setOptions] = useState([]);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const { data: topicData, mutate } = useSWR(
    mounted && baseURL + TOPIC_ENDPOINT.BASE + "/" + topicId,
    topicFetcher
  );
  const { data: tagData, isLoading } = useSWR(
    mounted &&
      process.env.NEXT_PUBLIC_BASE_URL +
        TAG_ENDPOINT.BASE +
        TAG_ENDPOINT.MAJOR_TAGS,
    tagsFetcher
  );
  const isTopicAccepted = topicData?.topicStatus === TopicStatus.Accepted;
  let steps: StepsProps["items"] = [
    { title: "Tạo chủ đề" },
    { title: "Chờ duyệt" },
    { title: "Đã duyệt", status: "finish" },
  ];
  const disabledInputRules = !canEdit || (isStudent() && isTopicAccepted);

  useEffect(() => {
    setMounted(true);

    return () => {
      clearCache(mutate);
    };
  }, []);

  useEffect(() => {
    if (!topicData) return;

    setTopic(topicData);
    form.setFieldsValue(topicData);
  }, [topicData]);

  useEffect(() => {
    if (!tagData) return;

    const mappedTagData = tagData.map((tag: TagDetails) => {
      return { value: tag.value, color: tag.color };
    });

    setOptions(mappedTagData);
  }, [tagData]);

  async function topicFetcher(url: string) {
    const res = await axios.get(url);

    return res.data.data;
  }

  async function handleSendTopic() {
    if (!user) return;

    const topicName = form.getFieldValue("topicName");
    const topicEnglishName = form.getFieldValue("topicEnglishName");
    const majorTag = form.getFieldValue("majorTag");
    const topicDescription = form.getFieldValue("topicDescription");
    try {
      await axios.post<any, any, any>(
        `${baseURL}${TOPIC_ENDPOINT.BASE}/${topicId}${TOPIC_ENDPOINT.SEND}`,
        {
          topicName,
          topicEnglishName,
          majorTag: majorTag,
          topicDescription,
          role: user.roles[0],
          updatedBy: `${user.lastName} ${user.firstName}`,
        }
      );

      message.success("Gửi chủ đề thành công !");
      mutate();
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
      await axios.put(`${baseURL}${TOPIC_ENDPOINT.BASE}/${topic._id}`);

      message.success("Yêu cầu chỉnh sửa thành công !");
      mutate();
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  async function handleAcceptTopic() {
    if (!topic) return;

    try {
      await axios.post(`${baseURL}${TOPIC_ENDPOINT.BASE}/${topic._id}`);

      message.success("Chấp nhận chủ đề thành công !");
      mutate();
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  async function tagsFetcher(url: string) {
    const { data } = await axios.get(url);

    return data.data;
  }

  function calculateSteps() {
    if (!topic) {
      return 0;
    }

    const errorStep: StepProps = {
      title: "Yêu cầu chỉnh sửa",
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

  if (!mounted) return null;

  if (!topicData && isLoading)
    return <Typography.Text>Loading...</Typography.Text>;

  return (
    <>
      <Modal
        width={600}
        title="Lịch sử thay đổi"
        open={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={[]}
      >
        <HistoryModalBody history={topicData?.history} />
      </Modal>
      <Content>
        <Title level={4} style={{ marginTop: 0 }}>
          Chủ đề luận văn
        </Title>
        <Form
          form={form}
          className="space-y-5"
          onFieldsChange={() =>
            setIsValid(handleValidateOnFieldChange(form, true))
          }
        >
          <Content className="flex items-center">
            <span className="w-52">Trạng thái: </span>
            <Steps
              items={steps}
              current={calculateSteps()}
              className="w-full"
            />
          </Content>
          <Content className="flex items-center">
            <span className="w-52">Tên đề tài: </span>
            <Item
              required
              className="w-full"
              name="topicName"
              style={{ marginBottom: 0 }}
              rules={[{ required: true, max: 100 }]}
            >
              <Input required type="text" readOnly={disabledInputRules} />
            </Item>
          </Content>
          <Content className="flex items-center">
            <span className="w-52">Tên đề tài bằng tiếng Anh: </span>
            <Item
              className="w-full"
              name="topicEnglishName"
              style={{ marginBottom: 0 }}
              rules={[{ required: true, max: 100 }]}
            >
              <Input type="text" readOnly={disabledInputRules} />
            </Item>
          </Content>
          <Content className="flex items-center">
            <span className="w-52">Chủ đề: </span>
            <Item
              name={"majorTag"}
              className="w-full"
              style={{ marginBottom: 0 }}
            >
              <Select
                className={`${disabledInputRules ? "readOnly" : ""}`}
                tagRender={MajorTag}
                options={options}
                showArrow
              />
            </Item>
          </Content>
          <Content className="flex items-center">
            <span className="w-52">Nội dung: </span>
            <Item
              className="w-full"
              name="topicDescription"
              style={{ marginBottom: 0 }}
              rules={[{ required: true, max: 300 }]}
            >
              <TextArea rows={4} readOnly={disabledInputRules} />
            </Item>
          </Content>
        </Form>
        <Divider />
        <TopicFormFooter
          setHistoryModalVisible={setHistoryModalVisible}
          topic={topic}
          canEdit={canEdit}
          handleAcceptTopic={handleAcceptTopic}
          handleRequestChangeTopic={handleRequestChangeTopic}
          handleResetField={handleResetField}
          handleSendTopic={handleSendTopic}
          isTopicAccepted={isTopicAccepted}
          isValid={isValid}
          setCanEdit={setCanEdit}
        />
      </Content>
      <style>
        {`.ant-select.readOnly
          {
            pointer-events: none;
          }`}
      </style>
    </>
  );
}

function HistoryModalBody({
  history,
}: {
  history: { updatedAt: Date; updatedBy: string }[] | undefined;
}) {
  const convertedHistory = history
    ? history.map((h) => ({ ...h, updatedAt: dayjs(h.updatedAt) }))
    : [];
  const isHistoryEmpty = convertedHistory.length === 0;

  return (
    <Content
      className={`flex flex-col h-96 space-y-3 overflow-auto ${
        isHistoryEmpty ? "justify-center" : ""
      }`}
    >
      {!isHistoryEmpty ? (
        convertedHistory.map((h, index) => (
          <Typography.Text>
            {(index += 1)}. {h.updatedAt.format("LLLL A ")}, người cập nhật:{" "}
            {h.updatedBy}
          </Typography.Text>
        ))
      ) : (
        <Typography.Text className="text-center">
          Không có lịch sử chỉnh sửa
        </Typography.Text>
      )}
    </Content>
  );
}

function TopicFormFooter(props: any) {
  return (
    <Content className="flex justify-between">
      <Typography.Link onClick={() => props.setHistoryModalVisible(true)}>
        Lịch sử thay đổi
      </Typography.Link>
      <Content className="flex justify-end space-x-2">
        {isStudent() && !props.isTopicAccepted && (
          <>
            <Button
              disabled={props.isTopicAccepted && !props.canEdit}
              onClick={props.handleResetField}
              type="ghost"
              className="text-white bg-red-600 hover:bg-red-500 transition-all disabled:bg-gray-100 disabled:text-gray-400"
            >
              Đặt lại
            </Button>
            <Button onClick={() => props.setCanEdit(true)} type="dashed">
              Chỉnh sửa đề tài
            </Button>
            <AtomLoadingButton
              disabled={!props.isValid}
              onClick={props.handleSendTopic}
              buttonProps={{ type: "primary" }}
            >
              Lưu đề tài
            </AtomLoadingButton>
          </>
        )}
        {isTeacher() && (
          <>
            {!props.isTopicAccepted && (
              <>
                <AtomLoadingButton
                  disabled={
                    props.topic?.topicStatus === TopicStatus.RequestChange ||
                    (!props.isTopicAccepted && !props.canEdit)
                  }
                  onClick={props.handleRequestChangeTopic}
                  buttonProps={{
                    type: "ghost",
                    className:
                      "text-white bg-red-600 hover:bg-red-500 transition-all disabled:bg-gray-100 disabled:text-gray-400",
                  }}
                >
                  Yêu cầu chỉnh sửa
                </AtomLoadingButton>
                <AtomLoadingButton
                  disabled={!props.isTopicAccepted}
                  onClick={props.handleAcceptTopic}
                  buttonProps={{ type: "primary" }}
                >
                  Duyệt đề tài
                </AtomLoadingButton>
                <Divider type="vertical" />
              </>
            )}
            {props.isTopicAccepted && (
              <Button onClick={() => props.setCanEdit(true)} type="dashed">
                Chỉnh sửa đề tài
              </Button>
            )}
            <AtomLoadingButton
              disabled={!props.isValid}
              onClick={props.handleSendTopic}
              buttonProps={{ type: "primary" }}
            >
              Lưu đề tài
            </AtomLoadingButton>
          </>
        )}
      </Content>
    </Content>
  );
}

import { Button, Layout, Tabs, TabsProps, Typography } from "antd";
import { useEffect, useState } from "react";
import { TopicStatus } from "../../../constants/enums";
import { Topic } from "../../../interfaces/topic.interface";
import { MCThesisProgressCalendar } from "../../molecules/calendar/thesis-progress-calendar.molecule";
import { MCTopicForm } from "../../molecules/form/topic-form.molecule";
import { MCFilesAndAssetsModal } from "../../molecules/modal/files-and-assets-modal.molecule";
import useSWR from "swr";
import { baseURL, STUDENT_ENDPOINT } from "../../../constants/endpoints";
import axios from "axios";
import { Student } from "../../../interfaces/student.interface";
import { MCProfileForm } from "../../molecules/form/profile-form.molecule";
import { useRecoilValue } from "recoil";
import { userState } from "../../../stores/auth.store";
import { isTeacher } from "../../../utils/role.util";

interface OGThesisProgressContentProps {
  MSSV?: string;
  data?: Student | null;
}

export function OGThesisProgressContent(props: OGThesisProgressContentProps) {
  const user = useRecoilValue<Student | null>(userState);
  const [MSSV, setMSSV] = useState(props.MSSV);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [mounted, setMounted] = useState(false);
  const { data } = useSWR<Student>(
    mounted && MSSV && baseURL + STUDENT_ENDPOINT.BASE + "/" + MSSV,
    datafetcher
  );
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Chủ đề luận văn`,
      children: (
        <MCTopicForm
          topicId={data?.topic?._id || props.data?.topic?._id}
          topic={topic}
          setTopic={setTopic}
        />
      ),
    },
    {
      key: "2",
      label: `Tiến trình luận văn`,
      children: <MCThesisProgressCalendar MSSV={MSSV} />,
      disabled: topic?.topicStatus !== TopicStatus.Accepted,
    },
    {
      key: "3",
      label: `Thông tin ${isTeacher() ? "sinh viên" : "giảng viên"}`,
      children: <MCProfileForm isGuestMode profile={user?.teacher || data} />,
    },
  ];

  useEffect(() => {
    setMounted(true);

    if (props.data) {
      setMSSV(data?.MSSV);
    }
  }, []);

  if (MSSV && !data) return null;

  async function datafetcher(url: string) {
    return (await axios.post(url)).data.data;
  }

  return (
    <Layout.Content className="space-y-3 my-5 mx-20">
      <Typography.Title level={3} style={{ marginBottom: 0 }} className="m-0">
        Báo cáo tiến độ luận văn
      </Typography.Title>
      <Tabs
        items={items}
        className="p-5 bg-white rounded-md shadow-md"
        tabBarExtraContent={{
          right: (
            <MCFilesAndAssetsModal MSSV={MSSV}>
              {(openModal) => (
                <Button type="primary" onClick={openModal}>
                  Files và Tài Liệu
                </Button>
              )}
            </MCFilesAndAssetsModal>
          ),
        }}
      />
    </Layout.Content>
  );
}

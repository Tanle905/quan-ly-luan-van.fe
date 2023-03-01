import { Button, Layout, Tabs, TabsProps, Typography } from "antd";
import { useState } from "react";
import { TopicStatus } from "../../../constants/enums";
import { Topic } from "../../../interfaces/topic.interface";
import { MCThesisProgressCalendar } from "../../molecules/calendar/thesis-progress-calendar.molecule";
import { MCTopicForm } from "../../molecules/form/topic-form.molecule";
import { MCFilesAndAssetsModal } from "../../molecules/modal/files-and-assets-modal.molecule";

interface OGThesisProgressContentProps {
  MSSV?: string;
}

export function OGThesisProgressContent({
  MSSV,
}: OGThesisProgressContentProps) {
  const [topic, setTopic] = useState<Topic | null>(null);
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Chủ đề luận văn`,
      children: <MCTopicForm MSSV={MSSV} topic={topic} setTopic={setTopic} />,
    },
    {
      key: "2",
      label: `Tiến trình luận văn`,
      children: <MCThesisProgressCalendar MSSV={MSSV} />,
      disabled: topic?.topicStatus !== TopicStatus.Accepted,
    },
  ];

  return (
    <Layout.Content className="space-y-3 my-5 mx-20">
      <Typography.Title level={3} style={{ marginBottom: 0 }} className="m-0">
        Báo cáo tiến độ luận văn
      </Typography.Title>
      <Tabs
        items={items}
        className="p-5 bg-white rounded-md shadow-md"
        tabBarExtraContent={{
          right:
            topic?.topicStatus === TopicStatus.Accepted ? (
              <MCFilesAndAssetsModal MSSV={MSSV}>
                {(openModal) => (
                  <Button type="primary" onClick={openModal}>
                    Files và Tài Liệu
                  </Button>
                )}
              </MCFilesAndAssetsModal>
            ) : (
              <></>
            ),
        }}
      />
    </Layout.Content>
  );
}

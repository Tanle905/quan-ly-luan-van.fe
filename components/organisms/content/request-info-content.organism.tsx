import { Layout, Tabs, TabsProps, Typography } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import { baseURL, REQUEST_ENDPOINT } from "../../../constants/endpoints";
import { useMount } from "../../../hooks/use-mount";
import { Request } from "../../../interfaces/request.interface";
import { isTeacher } from "../../../utils/role.util";
import { MCProfileForm } from "../../molecules/form/profile-form.molecule";
import { MCTopicForm } from "../../molecules/form/topic-form.molecule";

interface OGRequestInfoContentProps {}

export function OGRequestInfoContent({}: OGRequestInfoContentProps) {
  const [topic, setTopic] = useState(null);
  const router = useRouter();
  const { data } = useSWR<Request>(
    router.query.pid &&
      baseURL + REQUEST_ENDPOINT.BASE + "/" + router.query.pid,
    fetchData
  );
  const isMounted = useMount();

  if (!isMounted || !data) return null;

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Thảo luận chủ đề luận văn`,
      children: (
        <MCTopicForm
          topicId={data.topic?._id}
          topic={topic}
          setTopic={setTopic}
        />
      ),
    },
    {
      key: "2",
      label: `Thông tin ${isTeacher() ? "sinh viên" : "giảng viên"}`,
      children: (
        <MCProfileForm
          readOnly
          profile={isTeacher() ? data.student : data.teacher}
        />
      ),
    },
  ];

  async function fetchData(url: string) {
    const res = await axios.post(url);

    return res.data.data;
  }

  return (
    <Layout.Content className="space-y-3 my-5 mx-20">
      <Typography.Title level={3} style={{ marginBottom: 0 }} className="m-0">
        Chủ đề luận văn và chi tiết
      </Typography.Title>
      <Tabs items={items} className="p-5 bg-white rounded-md shadow-md" />
    </Layout.Content>
  );
}

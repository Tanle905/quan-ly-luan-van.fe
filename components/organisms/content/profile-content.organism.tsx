import { Collapse, Layout, Select, Tabs, Tag, Typography, message } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import {
  baseURL,
  PROFILE_ENDPOINT,
  TEACHER_ENDPOINT,
} from "../../../constants/endpoints";
import { User } from "../../../interfaces/user.interface";
import { userState } from "../../../stores/auth.store";
import { clearCache } from "../../../utils/swr.util";
import { MCProfileAvatarForm } from "../../molecules/form/profile-avatar-form.molecule";
import {
  MCProfileForm,
  MajorTag,
} from "../../molecules/form/profile-form.molecule";
import { Tab } from "rc-tabs/lib/interface";
import { Topic } from "../../../interfaces/topic.interface";
const { Content } = Layout;

interface OGPRofileContentProps {
  userId?: string;
}

export function OGPRofileContent({ userId }: OGPRofileContentProps) {
  const user = useRecoilValue<User | null>(userState);
  const isDifferentUser = userId ? true : false;
  const { data, mutate } = useSWR<User | undefined>(
    userId ? baseURL + PROFILE_ENDPOINT.BASE : null,
    userProfileFetcher
  );
  const items: Tab[] = [
    {
      key: "1",
      label: "Thông tin cá nhân",
      children: (
        <MCProfileForm
          profile={userId ? data : user}
          isGuestMode={userId ? true : false}
        />
      ),
    },
    ...(data
      ? [
          {
            key: "2",
            label: "Danh sách đề tài",
            children: <ThesisListAccordion MSCB={data?.MSCB} />,
          },
        ]
      : []),
  ];

  useEffect(() => {
    return () => {
      clearCache(mutate);
    };
  }, []);

  async function userProfileFetcher(url: string) {
    if (!user) return;

    try {
      const { data }: { data: User } = await axios.get(url + "/" + userId);

      return data;
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }
  if (userId && !data) return null;

  return (
    <>
      <Content className="my-5 mx-5 sm:mx-16 mt-2 space-y-2">
        <span className="text-2xl font-semibold text-gray-800">
          Trang cá nhân
        </span>
        <Content className="grid grid-cols-12 space-y-5 sm:space-y-0 sm:space-x-5">
          <Content className="col-span-12 sm:col-span-3 flex flex-col items-center">
            <MCProfileAvatarForm
              username={userId ? data?.username : user?.username}
              imageUrl={userId ? data?.imageUrl : user?.imageUrl}
              isDifferentUser={isDifferentUser}
            />
          </Content>
          <Content className="col-span-12 sm:col-span-9">
            <Tabs items={items} className="rounded-md shadow-md bg-white p-5" />
          </Content>
        </Content>
      </Content>
    </>
  );
}

function ThesisListAccordion({ MSCB }: any) {
  const { data: topicList } = useSWR(
    MSCB && baseURL + TEACHER_ENDPOINT.BASE + TEACHER_ENDPOINT.TOPIC,
    async (url: any) => (await axios.post(url, { MSCB })).data.data
  );

  if (!topicList) return null;

  return (
    <Layout.Content className="grid">
      {topicList.length === 0 ? (
        <span className="text-gray-500 font-extralight justify-self-center self-center">
          Danh sách trống
        </span>
      ) : (
        <Collapse>
          {topicList.map((topic: Topic, index: number) => (
            <Collapse.Panel key={index} header={topic.topicName}>
              <Layout.Content className="space-y-3">
                <div>
                  <span className="font-semibold">Người thực hiện: </span>
                  <Typography.Text>{topic.studentName}</Typography.Text>
                </div>
                <div>
                  <span className="font-semibold">Chủ đề: </span>
                  {topic.majorTag.map((tag) => (
                    <Tag>{tag.value}</Tag>
                  ))}
                </div>
                <div>
                  <span className="font-semibold">Nội dung: </span>
                  <Typography.Text>{topic.topicDescription}</Typography.Text>
                </div>
              </Layout.Content>
            </Collapse.Panel>
          ))}
        </Collapse>
      )}
    </Layout.Content>
  );
}

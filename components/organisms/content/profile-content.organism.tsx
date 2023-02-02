import { Layout, message } from "antd";
import axios from "axios";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import { PROFILE_ENDPOINT } from "../../../constants/endpoints";
import { User } from "../../../interfaces/user.interface";
import { userState } from "../../../stores/auth.store";
import { MCProfileAvatarForm } from "../../molecules/form/profile-avatar-form.molecule";
import { MCProfileForm } from "../../molecules/form/profile-form.molecule";
const { Content } = Layout;

interface OGPRofileContentProps {
  userId?: string;
}

export function OGPRofileContent({ userId }: OGPRofileContentProps) {
  const [msg, contextHolder] = message.useMessage();
  const user = useRecoilValue<User | null>(userState);
  const isDifferentUser = userId ? true : false;
  const { data } = useSWR<User | undefined>(
    userId && process.env.NEXT_PUBLIC_BASE_URL + PROFILE_ENDPOINT.BASE,
    userProfileFetcher
  );

  async function userProfileFetcher() {
    if (!user) return;

    try {
      const { data }: { data: User } = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL + PROFILE_ENDPOINT.BASE + "/" + userId
      );

      return data;
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  if (userId && !data) return null;
  return (
    <>
      {contextHolder}
      <Content className="mx-16 mt-2 space-y-2">
        <span className="text-2xl font-semibold text-gray-800">
          Trang cá nhân
        </span>
        <Content className="grid grid-cols-12 space-x-5">
          <Content className="col-span-3 flex flex-col items-center">
            <MCProfileAvatarForm
              username={userId ? data?.username : user?.username}
              imageUrl={userId ? data?.imageUrl : user?.imageUrl}
              isDifferentUser={isDifferentUser}
            />
          </Content>
          <Content className="col-span-9">
            <MCProfileForm profile={userId ? data : user} />
          </Content>
        </Content>
      </Content>
    </>
  );
}

import { Avatar, Button, Layout } from "antd";
import { useRecoilValue } from "recoil";
import { User } from "../../../interfaces/user.interface";
import { userState } from "../../../stores/auth.store";

export function MCProfileAvatarForm() {
  const user = useRecoilValue<User | null>(userState);

  return (
    <Layout.Content className="bg-white w-full h-52 py-5 space-y-4 rounded-md shadow-md flex flex-col items-center">
      <Avatar src={user?.imageUrl} className="w-36 h-36" />
      <div className="space-y-1 flex flex-col items-center">
        <div className="flex space-x-1">
        <span className="font-semibold text-sm text-gray-700">Tên đăng nhập: </span>
        <span className="text-sm text-gray-600">{user?.username}</span>
        </div>
        <Button type="primary">Đổi Avatar</Button>
      </div>
    </Layout.Content>
  );
}

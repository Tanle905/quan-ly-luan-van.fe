import { Avatar, Button, Layout } from "antd";

interface MCProfileAvatarFormProps {
  username: string | null | undefined;
  imageUrl: string | null | undefined;
  isDifferentUser: boolean;
}

export function MCProfileAvatarForm({
  username,
  imageUrl,
  isDifferentUser,
}: MCProfileAvatarFormProps) {
  return (
    <Layout.Content className="bg-white w-full h-52 py-5 space-y-4 rounded-md shadow-md flex flex-col items-center">
      <Avatar src={imageUrl} className="w-36 h-36" />
      {!isDifferentUser && (
        <div className="space-y-1 flex flex-col items-center">
          <div className="flex space-x-1">
            <span className="font-semibold text-sm text-gray-700">
              Tên đăng nhập:
            </span>
            <span className="text-sm text-gray-600">{username}</span>
          </div>
          <Button type="primary">Đổi Avatar</Button>
        </div>
      )}
    </Layout.Content>
  );
}

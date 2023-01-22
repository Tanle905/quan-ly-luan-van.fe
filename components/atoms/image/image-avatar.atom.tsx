import { PoweroffOutlined, TabletOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, MenuProps } from "antd";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import { LOCAL_STORAGE } from "../../../constants/local_storage_key";
import { SCREEN_ROUTE } from "../../../constants/screen-route";
import { User } from "../../../interfaces/user.interface";
import { userState } from "../../../stores/auth.store";

interface AtomImageAvatarProps {
  size?: number;
}

export function AtomImageAvatar({ size }: AtomImageAvatarProps) {
  const user: User | null = useRecoilValue(userState);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link href={SCREEN_ROUTE.PROFILE}>
          <TabletOutlined className="mr-2" />
          Xem Hồ Sơ
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <span onClick={handleSignOut}>
          <PoweroffOutlined className="mr-2" />
          Đăng xuất
        </span>
      ),
    },
  ];

  function handleSignOut() {
    localStorage.removeItem(LOCAL_STORAGE.USER_DATA);
    window.location.reload();
  }

  if (!user) return;

  return (
    <Dropdown menu={{ items }} placement={"bottomRight"}>
      <Avatar
        className="cursor-pointer"
        src={(user as User).imageUrl}
        alt={""}
        size={size || 40}
      />
    </Dropdown>
  );
}

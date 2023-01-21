import { Avatar, Dropdown, MenuProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { LOCAL_STORAGE } from "../../../constants/local_storage_key";
import { SCREEN_ROUTE } from "../../../constants/screen-route";
import { User } from "../../../interfaces/user.interface";
import { userState } from "../../../stores/auth.store";

interface AtomImageAvatarProps {
  size?: number;
}

export function AtomImageAvatar({ size }: AtomImageAvatarProps) {
  const router = useRouter();
  const user: User | null = useRecoilValue(userState);
  const resetUser = useResetRecoilState(userState);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <Link href={SCREEN_ROUTE.PROFILE}>Profile</Link>,
    },
    {
      key: "2",
      label: <span onClick={handleSignOut}>Sign Out</span>,
    },
  ];

  function handleSignOut() {
    resetUser();
    localStorage.removeItem(LOCAL_STORAGE.USER_DATA);
    router.push(SCREEN_ROUTE.LOGIN);
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

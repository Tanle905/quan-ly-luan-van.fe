import { Avatar } from "antd";

interface AtomImageAvatarProps {
  size?: number;
}

export function AtomImageAvatar({ size }: AtomImageAvatarProps) {
  return (
    <Avatar src={"https://i.pravatar.cc/300"} alt={""} size={size || 40} />
  );
}

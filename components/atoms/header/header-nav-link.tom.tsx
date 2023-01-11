import { Typography } from "antd";
import { icons } from "antd/es/image/PreviewGroup";
import Link from "next/link";

interface AtomHeaderNavLinkProps {
  title: string;
  href: string;
  icon?: any;
}

export function AtomHeaderNavLink({
  title,
  href,
  icon,
}: AtomHeaderNavLinkProps) {
  return (
    <Link className="no-underline text-center inline-block" href={href}>
      {icon && icon}
      {title}
    </Link>
  );
}

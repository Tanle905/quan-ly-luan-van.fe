import { Layout } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const isActive = router.pathname === href;
  const active = `text-gray-100 bg-indigo-600 hover:bg-indigo-500`;
  const inactive = `text-gray-800 hover:bg-indigo-500`;

  return (
    <Link
      className={`group rounded-md my-2 py-1 px-2 ${
        isActive ? active : inactive
      }  text-sm no-underline inline-block m-0 hover:text-gray-100 transition-all`}
      href={href}
    >
      {icon && icon}
      {title}
    </Link>
  );
}

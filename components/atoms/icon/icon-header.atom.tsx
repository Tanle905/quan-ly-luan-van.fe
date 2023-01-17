import { Layout } from "antd";

interface AtomIconHeaderProps {
  icon: any;
}

export function AtomIconHeader({ icon }: AtomIconHeaderProps) {
  return (
    <Layout.Content className="flex justify-center items-center p-1 w-6 h-6 hover:bg-indigo-600 hover:text-gray-100 transition-all cursor-pointer rounded-md">
      {icon}
    </Layout.Content>
  );
}

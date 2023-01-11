import { Layout } from "antd";
import { MCHeaderLeft } from "../../molecules/header/header-left.molecule";
import { MCHeaderRight } from "../../molecules/header/header-right.module";

export function OGHeader({}) {
  return (
    <Layout.Content className="flex justify-between px-20 py-1 bg-white shadow-sm">
      <MCHeaderLeft />
      <MCHeaderRight />
    </Layout.Content>
  );
}

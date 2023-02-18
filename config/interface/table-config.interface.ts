import { SelectProps } from "antd";
import { ColumnsType } from "antd/es/table";

export interface TableConfig {
  apiEndpoint?: string;
  data?: any;
  title?: string;
  subTitle?: string;
  filter?: FilterConfig[];
  search?: boolean;
  extraRightComponent?: [(props: TableProps) => any];
  query?: any;
  table: {
    columns: ColumnsType<object>;
  };
}

interface TableProps {
  href?: string | null;
}
export interface FilterConfig {
  key: string;
  label: string;
  endpoint?: string;
  data?: { value: string }[];
  selectProps?: SelectProps;
}

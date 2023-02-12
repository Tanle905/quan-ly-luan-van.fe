import { SelectProps } from "antd";
import { ColumnsType } from "antd/es/table";

export interface TableConfig {
  apiEndpoint: string;
  title?: string;
  subTitle?: string;
  filter?: FilterConfig[];
  search?: boolean;
  sort?: any;
  extraComponent?: [(props: TableProps) => any];
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

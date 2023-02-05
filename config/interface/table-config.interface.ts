import { SelectProps } from "antd";
import { ColumnsType } from "antd/es/table";

export interface TableConfig {
  apiEndpoint: string;
  title?: string;
  subTitle?: string;
  filter?: FilterConfig[];
  search?: boolean;
  sort?: any;
  extraComponent?: any[];
  table: {
    columns: ColumnsType<object>;
  };
}

export interface FilterConfig {
  key: string;
  label: string;
  endpoint?: string;
  data?: { value: string }[];
  selectProps?: SelectProps;
}

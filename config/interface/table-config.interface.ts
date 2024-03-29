import { SelectProps } from "antd";
import { ColumnsType } from "antd/es/table";

export interface TableConfig {
  apiEndpoint?: string;
  data?: any;
  title?: string;
  subTitle?: string;
  filter?: FilterConfig[];
  search?: boolean;
  extraRightComponent?: ((props: TableProps) => any)[];
  query?: any;
  table: {
    pageSize?: number;
    columns: ColumnsType<object>;
    transform?: (data: any) => any;
    redirect?: (data: any) => string;
  };
}

interface TableProps {
  key: any;
  href?: string | null;
}
export interface FilterConfig {
  key: string;
  label: string;
  endpoint?: string;
  data?: { value: string | null | undefined; label?: string }[];
  selectProps?: SelectProps;
}

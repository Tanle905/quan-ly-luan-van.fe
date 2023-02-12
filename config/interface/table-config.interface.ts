import { ColumnsType } from "antd/es/table";

export interface TableConfig {
  apiEndpoint: string;
  title?: string;
  subTitle?: string;
  filter?: any;
  search?: any;
  sort?: any;
  extraComponent?: [(props: TableProps) => any];
  query?: any,
  table: {
    columns: ColumnsType<object>;
  };
}

interface TableProps {
  href?: string | null;
}

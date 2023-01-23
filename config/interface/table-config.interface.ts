import { ColumnsType } from "antd/es/table";

export interface TableConfig {
  apiEndpoint: string;
  title?: string;
  subTitle?: string;
  filter?: any;
  search?: any;
  sort?: any;
  extraComponent?: any[];
  table: {
    columns: ColumnsType<object>;
  };
}

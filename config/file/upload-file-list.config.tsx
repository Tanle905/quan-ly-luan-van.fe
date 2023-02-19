import { AtomUploadFileAction } from "../../components/atoms/action/upload-file-table-action.atom";
import { TableConfig } from "../interface/table-config.interface";

export function uploadFileListConfig(
  configData: any,
  tableData: any
): TableConfig {
  return {
    title: "Danh sách file tải lên",
    subTitle: `${configData.totalFiles}/${configData.limit} Files đã được tải lên`,
    data: tableData,
    table: {
      columns: [
        {
          key: "fileName",
          title: "Tên",
          dataIndex: "fileName",
        },
        {
          key: "fileSize",
          title: "Dung lượng",
          dataIndex: "fileSize",
        },
        {
          key: "createdAt",
          title: "Ngày tải lên",
          dataIndex: "createdAt",
        },
        {
          key: "action",
          width: "5%",
          dataIndex: "ref",
          render: (value, record: any) => (
            <AtomUploadFileAction storageRef={value} />
          ),
        },
      ],
    },
  };
}

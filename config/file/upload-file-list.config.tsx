import { DownloadOutlined } from "@ant-design/icons";
import { handleDownload } from "../../utils/firebase";
import { TableConfig } from "../interface/table-config.interface";

export function uploadFileListConfig(data: any): TableConfig {
  return {
    title: "Danh sách file tải lên",
    data,
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
          dataIndex: "link",
          render: (value, record: any) => {

            return (
              <DownloadOutlined
                onClick={() => handleDownload(value)}
                className="text-lg hover:text-indigo-600 cursor-pointer transition-all"
              />
            );
          },
        },
      ],
    },
  };
}

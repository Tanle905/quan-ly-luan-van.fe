import { DownloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { AtomLoadingButton } from "./loading-button.atom";

interface AtomExportButtonProps {
  href: string;
}

export function AtomExportButton({ href }: AtomExportButtonProps) {
  async function dataFetcher() {
    const res = await axios.post(href);
    const data = res.data.data;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      data
        .map((row: any, index: any) => {
          if (index === 0) {
            return Object.keys(row);
          } else return Object.values(row);
        })
        .map((e: any) => e.join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");

    link.click();
  }

  return (
    <AtomLoadingButton onClick={dataFetcher} buttonProps={{ type: "primary" }}>
      <DownloadOutlined />
      Xuất File
    </AtomLoadingButton>
  );
}

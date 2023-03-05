import { DownloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { AtomLoadingButton } from "./loading-button.atom";

interface AtomExportButtonProps {
  href: string;
  title?: string;
}

export function AtomExportButton({ href, title }: AtomExportButtonProps) {
  async function dataFetcher() {
    const res = await axios.post(href);
    const data = res.data.data;
    data.unshift(Object.keys(data[0]));
    const csvContent =
      "data:text/csv;charset=utf-8," +
      data
        .map((row: any, index: any) => (index === 0 ? row : Object.values(row)))
        .map((e: any) => e.join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");

    link.click();
  }

  return (
    <AtomLoadingButton
      onClick={dataFetcher}
      buttonProps={{ type: "primary", className: "flex items-center" }}
    >
      <DownloadOutlined />
      <span className="m-0 text-sm">{title || "Xuất File CSV"}</span>
    </AtomLoadingButton>
  );
}

import { UploadOutlined } from "@ant-design/icons";
import { ButtonProps } from "antd";
import { AtomLoadingButton } from "./loading-button.atom";

interface AtomUploadButtonProps extends ButtonProps {
  href: string;
}

export function AtomUploadButton({ href, ...props }: AtomUploadButtonProps) {
  return (
    <AtomLoadingButton
      onClick={async () => {}}
      buttonProps={{
        type: "primary",
        className: "flex items-center",
        ...props,
      }}
    >
      <UploadOutlined />
      <span className="m-0 text-sm">Upload Tệp</span>
    </AtomLoadingButton>
  );
}

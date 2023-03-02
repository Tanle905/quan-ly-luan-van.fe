import { CloudUploadOutlined } from "@ant-design/icons";
import { Modal, ModalFuncProps, Upload } from "antd";
import { UploadChangeParam } from "antd/es/upload";
const { Dragger } = Upload;

interface MCUploadModalProps extends ModalFuncProps {
  title: string;
  onChange: (file: UploadChangeParam) => any;
}

export function MCUploadModal({
  title,
  onChange,
  ...props
}: MCUploadModalProps) {
  return (
    <Modal
      {...props}
      title={title}
      cancelText="Hủy bỏ"
      okText="Tải lên"
      destroyOnClose
    >
      <ModalContent onChange={onChange} />
    </Modal>
  );
}

function ModalContent({
  onChange,
}: {
  onChange: (file: UploadChangeParam) => any;
}) {
  return (
    <div className="rounded-md border-gray-700 border-2">
      <Dragger
        className="bg-indigo-400"
        onChange={onChange}
        multiple={false}
        showUploadList={false}
      >
        <p className="ant-upload-drag-icon">
          <CloudUploadOutlined />
        </p>
        <p className={"text-gray-800"}>Kéo thả file vào đây để upload.</p>
      </Dragger>
    </div>
  );
}

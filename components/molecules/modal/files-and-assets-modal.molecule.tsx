import { ArrowLeftOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { Divider, Layout, Modal, Upload } from "antd";
import { ReactNode, useState } from "react";
const { Dragger } = Upload;

interface MCFilesAndAssetsModalProps {
  children: (handleCloseModal: () => void) => ReactNode;
}

export function MCFilesAndAssetsModal({
  children,
}: MCFilesAndAssetsModalProps) {
  const [open, setOpen] = useState(false);

  function handleOpenModal() {
    setOpen(true);
  }

  function handleCloseModal() {
    setOpen(false);
  }

  return (
    <>
      <Modal
        title={<ModalTitle onBack={handleCloseModal} />}
        open={open}
        closable
        closeIcon={false}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={[]}
      >
        <div className="rounded-md border-gray-700 border-2">
          <Dragger>
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined />
            </p>
            <p className="ant-upload-text">Kéo thả file vào đây để upload</p>
          </Dragger>
        </div>
        <Divider className="py-2" />
        <Layout.Content></Layout.Content>
      </Modal>
      {children(handleOpenModal)}
    </>
  );
}

function ModalTitle({ onBack }: { onBack: () => void }) {
  return (
    <Layout.Content className="flex flex-col space-y-2">
      <span
        className="font-thin text-sm cursor-pointer hover:text-indigo-500 transition-all w-28"
        onClick={onBack}
      >
        <ArrowLeftOutlined className="mr-2 w-4" />
        Quay trở về
      </span>
      <span className="text-xl font-semibold">Tài Liệu và File Báo Cáo</span>
      <Divider className="pb-2" />
    </Layout.Content>
  );
}

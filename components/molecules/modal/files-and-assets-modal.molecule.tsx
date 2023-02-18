import { ArrowLeftOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { Divider, Layout, message, Modal, Upload } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { storage } from "../../../utils/firebase";
import { getDownloadURL, list, ref, uploadBytes } from "firebase/storage";
import { isTeacher } from "../../../utils/role.util";
import { useRecoilValue } from "recoil";
import { userState } from "../../../stores/auth.store";
import { Student } from "../../../interfaces/student.interface";
import { Teacher } from "../../../interfaces/teacher.interface";
import { OGTable } from "../../organisms/table/table.organism";
import { uploadFileListConfig } from "../../../config/file/upload-file-list.config";

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
        width={800}
        title={<ModalTitle onBack={handleCloseModal} />}
        open={open}
        closable
        closeIcon={false}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={[]}
      >
        <ModalContent />
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

function ModalContent() {
  const [msg, contextHolder] = message.useMessage();
  const user = useRecoilValue<Student | Teacher | null>(userState);
  const serialNumber = isTeacher() ? user?.MSCB : user?.MSSV;
  const [fileList, setFileList] = useState<any>([]);
  const curStorageRef = ref(storage, serialNumber);

  useEffect(() => {
    handleSetFileList();
  }, []);

  async function handleUploadFile(e: UploadChangeParam<UploadFile<any>>) {
    const { file } = e;
    const { originFileObj, name, status } = file;
    const fileRef = ref(storage, `${serialNumber}/${name}`);

    try {
      if (status !== "done") return;

      await uploadBytes(fileRef, originFileObj as Blob);

      handleSetFileList();
      message.success("Tải file lên thành công.");
    } catch (error: any) {
      message.error("Lỗi tải lên.");
    }
  }

  async function handleSetFileList() {
    const uploadedFileList = (await list(curStorageRef)).items.map(
      async (file) => {
        return {
          fileName: file.name,
          link: await getDownloadURL(file),
        };
      }
    );
    setFileList(await Promise.all(uploadedFileList));
  }

  return (
    <>
      {contextHolder}
      <div className="rounded-md border-gray-700 border-2">
        <Dragger
          onChange={handleUploadFile}
          multiple={false}
          showUploadList={false}
          progress={{
            strokeColor: {
              "0%": "#108ee9",
              "100%": "#87d068",
            },
            strokeWidth: 3,
            format: (percent) =>
              percent && `${parseFloat(percent.toFixed(2))}%`,
          }}
        >
          <p className="ant-upload-drag-icon">
            <CloudUploadOutlined />
          </p>
          <p className="ant-upload-text">Kéo thả file vào đây để upload</p>
        </Dragger>
      </div>
      <Divider className="py-2" />

      <Layout.Content>
        <OGTable config={uploadFileListConfig(fileList)} />
      </Layout.Content>
    </>
  );
}

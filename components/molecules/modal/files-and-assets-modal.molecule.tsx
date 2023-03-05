import {
  ArrowLeftOutlined,
  CloseCircleOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import { Divider, Layout, message, Modal, Upload } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { storage } from "../../../utils/firebase";
import { getMetadata, list, ref, uploadBytes } from "firebase/storage";
import { isStudent, isTeacher } from "../../../utils/role.util";
import { useRecoilValue } from "recoil";
import { userState } from "../../../stores/auth.store";
import { Student } from "../../../interfaces/student.interface";
import { Teacher } from "../../../interfaces/teacher.interface";
import { OGTable } from "../../organisms/table/table.organism";
import { uploadFileListConfig } from "../../../config/file/upload-file-list.config";
import { formatBytes } from "../../../utils/format.util";
import dayjs from "dayjs";
import { onModifyFileListSubject } from "../../../constants/observables";
import { THESIS_UPLOAD_FILE_LIMIT } from "../../../constants/variables";

const { Dragger } = Upload;

interface MCFilesAndAssetsModalProps {
  MSSV?: string;
  children: (handleCloseModal: () => void) => ReactNode;
}

export function MCFilesAndAssetsModal({
  MSSV,
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
        <ModalContent MSSV={MSSV} />
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
    </Layout.Content>
  );
}

function ModalContent({ MSSV }: { MSSV?: string }) {
  const user = useRecoilValue<Student | Teacher | null>(userState);
  const serialNumber = isTeacher() ? MSSV : user?.MSSV;
  const [fileList, setFileList] = useState<any[]>([]);
  const curStorageRef = ref(storage, serialNumber);
  const fileLimit = THESIS_UPLOAD_FILE_LIMIT;
  const isAtFileUploadLimit = fileList.length >= fileLimit;

  useEffect(() => {
    const onModifyFileListSubscription = onModifyFileListSubject.subscribe({
      next: () => {
        handleSetFileList();
      },
    });

    handleSetFileList();

    return () => {
      onModifyFileListSubscription.unsubscribe();
    };
  }, []);

  async function handleUploadFile(e: UploadChangeParam<UploadFile<any>>) {
    const { file } = e;
    const { originFileObj, name, status } = file;
    const fileRef = ref(storage, `${serialNumber}/${name}`);
    try {
      if (status !== "done") return;

      const uploadedFile = await uploadBytes(fileRef, originFileObj as Blob);
      console.log(uploadedFile.ref);
      handleSetFileList();
      message.success("Tải file lên thành công.");
    } catch (error: any) {
      message.error("Lỗi tải lên.");
    }
  }

  async function handleSetFileList() {
    const uploadedFileList = (await list(curStorageRef)).items.map(
      async (file) => {
        const metaData = await getMetadata(file);

        return {
          fileName: file.name,
          fileSize: formatBytes(metaData.size),
          createdAt: dayjs(metaData.timeCreated).utc().format("LL"),
          ref: file,
        };
      }
    );
    setFileList(await Promise.all(uploadedFileList));
  }

  return (
    <>
      {isStudent() && (
        <>
          <Divider className="pb-2" />
          <div className="rounded-md border-gray-700 border-2">
            <Dragger
              className="bg-indigo-400"
              disabled={isAtFileUploadLimit}
              onChange={handleUploadFile}
              multiple={false}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                {isAtFileUploadLimit ? (
                  <CloseCircleOutlined />
                ) : (
                  <CloudUploadOutlined />
                )}
              </p>
              <p
                className={`${
                  isAtFileUploadLimit ? "text-red-500" : "text-gray-800"
                }`}
              >
                {isAtFileUploadLimit
                  ? "Đã đạt giới hạn file tải lên cho phép. Vui lòng xóa bớt file để tiếp tục tải lên."
                  : "Kéo thả file vào đây để upload."}
              </p>
            </Dragger>
          </div>
          <Divider className="py-2" />
        </>
      )}

      <Layout.Content>
        <OGTable
          config={uploadFileListConfig(
            { totalFiles: fileList.length, limit: fileLimit },
            fileList
          )}
        />
      </Layout.Content>
    </>
  );
}

import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import { StorageReference } from "firebase/storage";
import {
  handleDeleteFileFromFirebase,
  handleDownloadFileFromFirebase,
} from "../../../utils/firebase";
import { isStudent } from "../../../utils/role.util";

interface AtomTeacherTableActionProps {
  storageRef: StorageReference;
}

export function AtomUploadFileAction({
  storageRef,
}: AtomTeacherTableActionProps) {

  return (
    <Layout.Content className="flex justify-end space-x-3">
      {isStudent() && (
        <DeleteOutlined
          onClick={() => handleDeleteFileFromFirebase(storageRef)}
          className="text-lg text-red-500 hover:text-red-400 cursor-pointer transition-all"
        />
      )}
      <DownloadOutlined
        onClick={() => handleDownloadFileFromFirebase(storageRef)}
        className="text-lg text-indigo-600 hover:text-indigo-400 cursor-pointer transition-all"
      />
    </Layout.Content>
  );
}

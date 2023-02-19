import { initializeApp } from "firebase/app";
import {
  deleteObject,
  getBlob,
  getStorage,
  StorageReference,
} from "firebase/storage";
import axios from "axios";
import { message } from "antd";
import { onModifyFileListSubject } from "../constants/observables";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "quanliluanvan.firebaseapp.com",
  projectId: "quanliluanvan",
  storageBucket: "quanliluanvan.appspot.com",
  messagingSenderId: "601918065674",
  appId: "1:601918065674:web:a5c8d4cd22ae70c55f63f3",
});

export const storage = getStorage(app);

export async function handleDownloadFileFromFirebase(
  storageRef: StorageReference
) {
  const blob = await getBlob(storageRef);

  const link = document.createElement("a");
  const href = window.URL.createObjectURL(blob);
  link.href = href;
  link.download = storageRef.name;
  link.click();

  //Clean ups
  link.remove();
  URL.revokeObjectURL(href);
}

export async function handleDeleteFileFromFirebase(
  storageRef: StorageReference
) {
  await deleteObject(storageRef);
  message.success("Xóa file thành công.");
  onModifyFileListSubject.next(1);
}

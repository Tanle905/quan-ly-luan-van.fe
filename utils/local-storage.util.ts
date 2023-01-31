import { LOCAL_STORAGE } from "../constants/local_storage_key";
import { User } from "../interfaces/user.interface";

export function getToken() {
  if (!localStorage.getItem(LOCAL_STORAGE.USER_DATA)) return null;
  return (
    JSON.parse(localStorage.getItem(LOCAL_STORAGE.USER_DATA) as string) as User
  ).accessToken;
}

import { NextRouter } from "next/router";
import { LOCAL_STORAGE } from "../constants/local_storage_key";
import { SCREEN_ROUTE } from "../constants/screen-route";
import { Student } from "../interfaces/student.interface";
import { Teacher } from "../interfaces/teacher.interface";
import { isAdmin, isStudent } from "./role.util";

export function loginRouteProtection(router: NextRouter) {
  if (!localStorage.getItem(LOCAL_STORAGE.USER_DATA))
    router.push(SCREEN_ROUTE.LOGIN);
  else if (router.pathname === SCREEN_ROUTE.LOGIN)
    router.push(SCREEN_ROUTE.BASE);
}

export function calendarRouteProtection(router: NextRouter) {
  if (!localStorage.getItem(LOCAL_STORAGE.USER_DATA)) return;

  const userData: Teacher & Student = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE.USER_DATA) as string
  );

  if (
    router.pathname === SCREEN_ROUTE.THESIS_PROGRESS &&
    (!isStudent() || (isStudent() && !userData.teacher))
  )
    router.push(SCREEN_ROUTE.BASE);

  if (router.pathname === SCREEN_ROUTE.BASE && isStudent() && userData.teacher)
    router.push(SCREEN_ROUTE.THESIS_PROGRESS);
}

export function adminRouteProtection(router: NextRouter) {
  if (!localStorage.getItem(LOCAL_STORAGE.USER_DATA)) return;

  if (!isAdmin() && router.pathname.search(SCREEN_ROUTE.ADMIN.BASE) !== -1) {
    router.push(SCREEN_ROUTE.UNAUTHORIZED);
  }
}

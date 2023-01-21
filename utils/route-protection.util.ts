import { NextRouter } from "next/router";
import { LOCAL_STORAGE } from "../constants/local_storage_key";
import { SCREEN_ROUTE } from "../constants/screen-route";

export function loginRouteProtection(router: NextRouter) {
  if (!localStorage.getItem(LOCAL_STORAGE.USER_DATA))
    router.push(SCREEN_ROUTE.LOGIN);
  else if (router.pathname === SCREEN_ROUTE.LOGIN)
    router.push(SCREEN_ROUTE.BASE);
}

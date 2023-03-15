import { Button, Layout } from "antd";
import axios from "axios";
import {
  baseURL,
  THESIS_DEFENSE_SCHEDULE_ENDPOINT,
} from "../../../constants/endpoints";
import { withAdminSideBar } from "../../molecules/sidebar-menu/admin-sidebar-menu.molecule";
import { OGScheduleContent } from "./schedule-content.organism";

export function OGAdminContent() {
  async function handleAutoScheduling() {
    await axios.get(
      baseURL +
        THESIS_DEFENSE_SCHEDULE_ENDPOINT.BASE +
        THESIS_DEFENSE_SCHEDULE_ENDPOINT.CALENDAR.BASE
    );
  }

  return (
    <Layout.Content className="w-full p-5">
      <OGScheduleContent
        rightComponent={
          <Button type="primary" onClick={handleAutoScheduling}>
            Tự động sắp lịch
          </Button>
        }
      />
    </Layout.Content>
  );
}

export const OGAdminContentWithAdminSizeBar = withAdminSideBar(OGAdminContent);

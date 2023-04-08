import { Button, Layout, message, Space } from "antd";
import axios from "axios";
import { useState } from "react";
import {
  baseURL,
  THESIS_DEFENSE_SCHEDULE_ENDPOINT,
} from "../../../constants/endpoints";
import { calendarEventSendSubject } from "../../../constants/observables";
import { MCAdminScheduleManagementModal } from "../../molecules/modal/admin-schedule-management-modal.molecule";
import { withAdminSideBar } from "../../molecules/sidebar-menu/admin-sidebar-menu.molecule";
import { OGScheduleContent } from "./schedule-content.organism";
import { Roles } from "../../../constants/enums";

export function OGAdminContent() {
  const [
    isScheduleManagementModalVisible,
    setIsScheduleManagementModalVisible,
  ] = useState(false);

  function handleOpenModal() {
    setIsScheduleManagementModalVisible(true);
  }

  async function handleAutoScheduling() {
    try {
      await axios.get(
        baseURL +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.BASE +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.CALENDAR.BASE +
          THESIS_DEFENSE_SCHEDULE_ENDPOINT.CALENDAR.THESIS_DEFENSE_TIME
      );

      calendarEventSendSubject.next(1);
      message.success("Tự động sắp lịch thành công");
    } catch (error: any) {
      message.error(error?.response?.data?.message);
    }
  }

  return (
    <Layout.Content className="w-full p-5">
      <MCAdminScheduleManagementModal
        isOpen={isScheduleManagementModalVisible}
        setIsOpen={setIsScheduleManagementModalVisible}
      />
      <OGScheduleContent
        role={Roles.ADMIN}
        rightComponent={
          <Space>
            <Button type="primary" onClick={handleOpenModal}>
              Quản lý lịch biểu
            </Button>
            <Button type="primary" onClick={handleAutoScheduling}>
              Tự động sắp lịch
            </Button>
          </Space>
        }
      />
    </Layout.Content>
  );
}

export const OGAdminContentWithAdminSizeBar = withAdminSideBar(OGAdminContent);

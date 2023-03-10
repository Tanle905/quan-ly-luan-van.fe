import axios from "axios";
import { NOTIFICATION_ENDPOINT } from "../constants/endpoints";
import { Notification } from "../interfaces/notification.interface";

export const NotificationService = {
  sendNotification: async ({
    user,
    receiver,
    content,
  }: {
    user: any;
    receiver: string;
    content: string;
  }) => {
    const notificationBody: Notification = {
      receiver,
      content,
    };

    await axios.post(process.env.NEXT_PUBLIC_BASE_URL + NOTIFICATION_ENDPOINT.BASE, notificationBody);
  },
};

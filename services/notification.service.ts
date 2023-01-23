import axios from "axios";
import { baseUrl, NOTIFICATION_ENDPOINT } from "../constants/endpoints";
import { Notification } from "../interfaces/notification.interface";

export const NotificationService = {
  sendNotification: async ({
    user,
    sender,
    receiver,
    content,
  }: {
    user: any;
    sender: string;
    receiver: string;
    content: string;
  }) => {
    const notificationBody: Notification = {
      sender,
      receiver,
      content,
    };

    await axios.post(baseUrl + NOTIFICATION_ENDPOINT.BASE, notificationBody, {
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
  },
};

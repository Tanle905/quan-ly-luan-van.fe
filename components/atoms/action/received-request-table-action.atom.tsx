import {
    MessageOutlined,
    InfoCircleOutlined,
    CloseOutlined,
    CheckOutlined,
  } from "@ant-design/icons";
  import { Layout, message, Tooltip } from "antd";
  import axios from "axios";
  import { useRouter } from "next/router";
  import { useRecoilValue } from "recoil";
  import { REQUEST_ENDPOINT } from "../../../constants/endpoints";
  import {
    reloadProfileSubject,
    reloadTableSubject,
  } from "../../../constants/observables";
  import { SCREEN_ROUTE } from "../../../constants/screen-route";
  import { Request } from "../../../interfaces/request.interface";
  import { Student } from "../../../interfaces/student.interface";
  import { userState } from "../../../stores/auth.store";
  
  interface AtomReceivedRequestTableActionProps {
    request: Request;
  }
  
  export function AtomReceivedRequestTableAction({
    request,
  }: AtomReceivedRequestTableActionProps) {
    const user = useRecoilValue<Student | null>(userState);
    const router = useRouter();
  
    async function handleAcceptRequest() {
      try {
        await axios.post(
          process.env.NEXT_PUBLIC_BASE_URL +
            REQUEST_ENDPOINT.BASE +
            REQUEST_ENDPOINT.ACCEPT,
          {
            id: request._id,
          }
        );
  
        reloadTableSubject.next(1);
        message.success("Chấp nhận yêu cầu thành công");
      } catch (error: any) {
        message.error(error.response.data.message);
      }
    }
  
    async function handleDeleteRequest() {
      if (!user?.MSSV) return;
  
      try {
        await axios.post(
          process.env.NEXT_PUBLIC_BASE_URL +
            REQUEST_ENDPOINT.BASE +
            REQUEST_ENDPOINT.REJECT,
          {
            id: request._id,
            MSSV: user.MSSV,
          }
        );
  
        reloadProfileSubject.next(1);
        reloadTableSubject.next(1);
        message.success("Xóa yêu cầu thành công");
      } catch (error: any) {
        message.error(error.response.data.message);
      }
    }
    return (
      <Layout.Content className="flex justify-end space-x-1">
        <Tooltip title="Chấp nhận yêu cầu">
          <CheckOutlined
            onClick={handleAcceptRequest}
            className="cursor-pointer p-2 text-green-600 hover:bg-indigo-600 hover:text-white rounded-md transition-all"
          />
        </Tooltip>
        <Tooltip title="Xóa yêu cầu">
          <CloseOutlined
            onClick={handleDeleteRequest}
            className="cursor-pointer p-2 text-red-600 hover:bg-indigo-600 hover:text-white rounded-md transition-all"
          />
        </Tooltip>
        <Tooltip title="Gửi tin cho giảng viên">
          <MessageOutlined className="cursor-pointer p-2 hover:bg-indigo-600 hover:text-white rounded-md transition-all" />
        </Tooltip>
        <Tooltip title="Thông tin giảng viên và đề tài">
          <InfoCircleOutlined
            onClick={() =>
              router.push(`${SCREEN_ROUTE.REQUEST_INFO}/${request._id}`)
            }
            className="cursor-pointer p-2 hover:bg-indigo-600 hover:text-white rounded-md transition-all"
          />
        </Tooltip>
      </Layout.Content>
    );
  }
  
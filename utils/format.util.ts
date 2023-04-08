import { ThesisStatus, TopicStatus } from "../constants/enums";

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function handleRenderTopicStatus(status: string | null) {
  let statusText = "";

  switch (status) {
    case null:
      statusText = "Tạo chủ đề";
      break;
    case TopicStatus.Pending:
      statusText = "Chờ duyệt";
      break;
    case TopicStatus.RequestChange:
      statusText = "Yêu cầu chỉnh sửa";
      break;
    case TopicStatus.Accepted:
      statusText = "Đã duyệt";
      break;
    default:
      status = "";
      break;
  }

  return statusText;
}

export function handleRenderStudentStatus(status: string | null) {
  let statusText = "";

  switch (status) {
    case null:
      statusText = "Giảng viên chưa nộp danh sách";
      break;
    case ThesisStatus.IsHadThesisDefenseSchedule:
      statusText = "Đã có lịch báo cáo";
      break;
    case ThesisStatus.IsReadyForThesisDefense:
      statusText = "Chưa có lịch báo cáo";
      break;
    case ThesisStatus.IsMarkedForIncomplete:
      statusText = "Nhận điểm I";
      break;
    default:
      statusText = "Giảng viên chưa nộp danh sách";
      break;
  }

  return statusText;
}

import { Modal } from "antd";

interface MCAddEventModalProps {
  isModalVisible: boolean;
  setIsModelVisible: any;
}

export function MCAddEventModal({
  isModalVisible,
  setIsModelVisible,
}: MCAddEventModalProps) {
  return (
    <Modal
      open={isModalVisible}
      title="Thêm sự kiện"
      destroyOnClose
      onOk={() => setIsModelVisible(false)}
      closable
      onCancel={()=> setIsModelVisible(false)}
    ></Modal>
  );
}

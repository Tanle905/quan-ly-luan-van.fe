import { Button, ButtonProps, message } from "antd";
import { useState } from "react";

interface AtomLoadingButtonProps {
  disabled?: any;
  onClick: () => Promise<any>;
  buttonProps?: ButtonProps;
  children: any;
}

export function AtomLoadingButton({
  disabled,
  onClick,
  buttonProps = {},
  children,
}: AtomLoadingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleOnClick() {
    setIsLoading(true);
    try {
      await onClick();
    } catch (error) {
      message.error("Error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      {...buttonProps}
      onClick={handleOnClick}
      disabled={isLoading || disabled}
      loading={isLoading}
    >
      {isLoading ? "Đang tải" : children}
    </Button>
  );
}

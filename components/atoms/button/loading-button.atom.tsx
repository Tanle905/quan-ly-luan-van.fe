import { Button, ButtonProps } from "antd";
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
    await onClick();
    setIsLoading(false);
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

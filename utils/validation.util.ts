import { FormInstance } from "antd";

export function handleValidateOnFieldChange(
  form: FormInstance,
  isRequiredAll = true
) {
  return !(
    form.getFieldsError().some((field) => field.errors.length > 0) ||
    (isRequiredAll &&
      Object.values(form.getFieldsValue()).some((field) => field === undefined))
  );
}

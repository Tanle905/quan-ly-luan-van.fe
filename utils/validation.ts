import { FormInstance } from "antd";

export function handleValidateOnFieldChange(
  form: FormInstance,
  setIsValid: any
) {
  const isInvalid =
    Object.values(form.getFieldsValue()).some((field) => field === undefined) ||
    form.getFieldsError().some((field) => field.errors.length > 0);
  setIsValid(!isInvalid);
}

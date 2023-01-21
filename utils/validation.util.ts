import { FormInstance } from "antd";

export function handleValidateOnFieldChange(
  form: FormInstance,
  setIsValid: any,
  isRequiredAll = true
) {
  const isInvalid =
    form.getFieldsError().some((field) => field.errors.length > 0) ||
    (isRequiredAll &&
      Object.values(form.getFieldsValue()).some(
        (field) => field === undefined
      ));
  setIsValid(!isInvalid);
}

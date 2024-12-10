import * as yup from "yup";

// Product Schema with Custom Validation Messages
export const productSchemaValidation = yup.object().shape({
  id: yup
    .number()
    .typeError("ID must be a valid number") // Custom type error for number
    .required("ID is required"),
  title: yup
    .string()
    .min(4, "Title must be at least 4 characters long")
    .max(20, "Title must not exceed 20 characters")
    .required("Title is required"),
  price: yup
    .number()
    .typeError("Price must be a valid number") // Custom type error for number
    .required("Price is required"),
});

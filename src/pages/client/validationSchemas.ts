import * as yup from "yup";

// Schema for contact info form (used in booking - description not required)
export const contactInfoSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email format"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d+$/, "Phone number must contain only digits")
    .min(7, "Phone number must be at least 7 digits")
    .max(15, "Phone number must be at most 15 digits"),
  description: yup.string().notRequired(),
});

// Schema for inquiry form (includes description)
export const inquirySchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email format"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d+$/, "Phone number must contain only digits")
    .min(7, "Phone number must be at least 7 digits")
    .max(15, "Phone number must be at most 15 digits"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be at most 1000 characters"),
});

// Helper function to create dynamic schema for custom form fields
export const createCustomFormSchema = (formFields: Array<{ id: string; label: string; isRequired: boolean; fieldType: string; options?: string[] }>) => {
  const schemaShape: Record<string, any> = {};
  
  formFields.forEach((field) => {
    if (field.isRequired) {
      schemaShape[field.id] = yup
        .mixed()
        .required(`${field.label} is required`)
        .test("not-empty", `${field.label} is required`, function(value) {
          if (field.fieldType === "checkbox") {
            return Array.isArray(value) && value.length > 0;
          }
          if (field.options && field.options.length > 0) {
            // For radio/select with options
            return value !== "" && value !== null && value !== undefined;
          }
          return value !== "" && value !== null && value !== undefined;
        });
    } else {
      schemaShape[field.id] = yup.mixed().notRequired();
    }
  });
  
  return yup.object().shape(schemaShape);
};


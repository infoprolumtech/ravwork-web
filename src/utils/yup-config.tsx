import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Must be a valid email format")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required"),
});
export const forgotPassSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});
export const resetPassSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one digit")
    .matches(/[^A-Za-z0-9]/, "Must contain at least one special character")
    .test("password-complexity", "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.", function(value) {
      if (!value) return true; // Let required validation handle empty case
      const hasMinLength = value.length >= 8;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(value);
      return hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    }),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm Password is required"),
});
export const changePassSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required("New Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one digit")
    .matches(/[^A-Za-z0-9]/, "Must contain at least one special character")
    .test("no-leading-trailing-spaces", "Invalid characters detected. Please choose a valid password.", function(value) {
      if (!value) return true;
      return value === value.trim();
    })
    .test("valid-characters", "Invalid characters detected. Please choose a valid password.", function(value) {
      if (!value) return true;
      // Allow common password characters, reject unusual Unicode
      return /^[\x20-\x7E]+$/.test(value);
    }),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Password does not match")
    .required("Confirm New Password is required"),
});
export const reasonSchema = yup.object().shape({
  reason: yup
    .string()
    .required("Reason is required")
    .trim()
    // .matches(/^[A-Za-z0-9 ]+$/, "Reason must not contain special characters")
    // .min(20, "Reason must be at least 20 characters long"),
});

export const userCohortSchema = yup.object().shape({
  name: yup.string().required("Cohort name is required"),
  age: yup.string().required("age is required"),
  gender: yup.string().required("gender is required"),
  location: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one location")
    .required("Location is required"),
  condition: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one condition")
    .required("Condition is required"),
  medication: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one medication")
    .required("Medication is required"),
  allergies: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one allergies")
    .required("Allergies is required"),
  interest: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one interest")
    .required("Interest is required"),
});
export const addCategorySchema = yup.object().shape({
  categoryName: yup
    .string()
    .required("Category name is required")
    .trim()
    .min(1, "Category name cannot be empty")
    .test("no-whitespace-only", "Category name cannot contain only whitespace", function(value) {
      if (!value) return true; // Let required validation handle empty case
      return value.trim().length > 0;
    })
    .test("min-length-after-trim", "Category name must be at least 2 characters", function(value) {
      if (!value) return true; // Let required validation handle empty case
      return value.trim().length >= 2;
    })
    .test("max-length", "Category name cannot exceed 50 characters", function(value) {
      if (!value) return true; // Let required validation handle empty case
      return value.trim().length <= 50;
    })
    .test("valid-characters", "Category name contains invalid characters. Only letters, numbers, spaces, and hyphens are allowed.", function(value) {
      if (!value) return true; // Let required validation handle empty case
      const trimmedValue = value.trim();
      // Allow letters, numbers, spaces, and hyphens
      return /^[A-Za-z0-9\s-]+$/.test(trimmedValue);
    })
    .test("no-leading-trailing-spaces", "Category name cannot start or end with spaces", function(value) {
      if (!value) return true; // Let required validation handle empty case
      return value === value.trim();
    }),
});
export const addSubCategorySchema = yup.object().shape({
  categoryId: yup.string().required("Category ID is required"),
  subCategoryName: yup
    .string()
    .required("Sub category name is required")
    .trim()
    .min(1, "Sub category name cannot be empty")
    .test("no-whitespace-only", "Sub category name cannot contain only whitespace", function(value) {
      if (!value) return true; // Let required validation handle empty case
      return value.trim().length > 0;
    })
    .test("min-length-after-trim", "Sub category name must be at least 2 characters", function(value) {
      if (!value) return true; // Let required validation handle empty case
      return value.trim().length >= 2;
    })
    .test("max-length", "Sub category name cannot exceed 50 characters", function(value) {
      if (!value) return true; // Let required validation handle empty case
      return value.trim().length <= 50;
    })
    .test("valid-characters", "Sub category name contains invalid characters. Only letters, numbers, spaces, and hyphens are allowed.", function(value) {
      if (!value) return true; // Let required validation handle empty case
      const trimmedValue = value.trim();
      // Allow letters, numbers, spaces, and hyphens
      return /^[A-Za-z0-9\s-]+$/.test(trimmedValue);
    })
    .test("no-leading-trailing-spaces", "Sub category name cannot start or end with spaces", function(value) {
      if (!value) return true; // Let required validation handle empty case
      return value === value.trim();
    }),
});
export const addTagSchema = yup.object().shape({
  tagName: yup
    .string()
    .required("Tag name is required")
    .trim()
    .min(1, "Tag name cannot be empty")
    .test("no-whitespace-only", "Tag name cannot contain only whitespace", function(value) {
      if (!value) return true; // Let required validation handle empty case
      return value.trim().length > 0;
    })
    .test("min-length-after-trim", "Tag name must be at least 2 characters", function(value) {
      if (!value) return true; // Let required validation handle empty case
      return value.trim().length >= 2;
    })
    .test("max-length", "Tag name cannot exceed 50 characters", function(value) {
      if (!value) return true; // Let required validation handle empty case
      return value.trim().length <= 50;
    })
    .test("valid-characters", "Tag name contains invalid characters. Only letters, numbers, spaces, and hyphens are allowed.", function(value) {
      if (!value) return true; // Let required validation handle empty case
      const trimmedValue = value.trim();
      // Allow letters, numbers, spaces, and hyphens
      return /^[A-Za-z0-9\s-]+$/.test(trimmedValue);
    })
    .test("no-leading-trailing-spaces", "Tag name cannot start or end with spaces", function(value) {
      if (!value) return true; // Let required validation handle empty case
      return value === value.trim();
    }),
  categoryName: yup.string().required("Category name is required"),
});

// Schema for keywords/diseases validation
export const keywordDiseaseSchema = yup.object().shape({
  keyword: yup
    .string()
    .required("Keyword is required")
    .trim()
    .min(1, "Keyword cannot be empty")
    .test("no-whitespace-only", "Keyword cannot contain only whitespace", function(value) {
      if (!value) return true; // Let required validation handle empty case
      return value.trim().length > 0;
    })
    .test("min-length-after-trim", "Keyword must be at least 2 characters", function(value) {
      if (!value) return true; // Let required validation handle empty case
      return value.trim().length >= 2;
    })
    .test("max-length", "Keyword cannot exceed 50 characters", function(value) {
      if (!value) return true; // Let required validation handle empty case
      return value.trim().length <= 50;
    })
    .test("valid-characters", "Keyword contains invalid characters. Only letters, numbers, spaces, and hyphens are allowed.", function(value) {
      if (!value) return true; // Let required validation handle empty case
      const trimmedValue = value.trim();
      // Allow letters, numbers, spaces, and hyphens
      return /^[A-Za-z0-9\s-]+$/.test(trimmedValue);
    })
    .test("no-leading-trailing-spaces", "Keyword cannot start or end with spaces", function(value) {
      if (!value) return true; // Let required validation handle empty case
      return value === value.trim();
    }),
});

export const scrappingRuleSchema = yup.object().shape({
  flagging: yup
    .array()
    .of(
      yup
        .string()
        .trim()
        .min(2, "Keyword must be at least 2 characters")
        .max(50, "Keyword cannot exceed 50 characters")
        .test("no-whitespace-only", "Keyword cannot contain only whitespace", function(value) {
          if (!value) return true;
          return value.trim().length > 0;
        })
        .test("valid-characters", "Keyword contains invalid characters. Only letters, numbers, spaces, and hyphens are allowed.", function(value) {
          if (!value) return true;
          const trimmedValue = value.trim();
          return /^[A-Za-z0-9\s-]+$/.test(trimmedValue);
        })
    )
    .optional(),
});
export const faqFormSchema = yup.object().shape({
  question: yup
    .string()
    .required("Question is required")
    .min(15, "Atleast 15 character required"),
  answer: yup
        .string()
        .required("Answer is required")
        .min(30, "Atleast 30 character required")
});
export const notificationSchema = yup.object().shape({
  scheduleDate: yup.date().required("Date is required"),
  scheduleTime: yup.string().required("Time is required"),
  notificationType: yup.string().oneOf(["email", "push"], "Please select a valid type").required("Type is required"),
  cohort: yup.array().of(yup.string()).min(1, "Cohort is required").required("Cohort is required"),
  subject: yup.string().required("Subject/Heading is required").min(5, "Subject must be at least 5 characters"),
  content: yup.string()
    .required("Content is required")
    .test("content-length", "Content must be at least 10 characters", function(value) {
      // Remove HTML tags for email content to check actual text length
      const textContent = value ? value.replace(/<[^>]*>/g, "").trim() : "";
      return textContent.length >= 10;
    }),
});
export const UpdateSubAdminRoleSchema = yup.object().shape({
  role: yup.string().required("Role is required"),
});
export const createSubAdminSchema = yup.object().shape({
  name: yup.string().required("User Name is required"),
  email: yup
    .string()
    .required("User Email Address is required")
    .email("Enter a valid email address"),
  role: yup.string().required("Role is required"),
});

import * as yup from "yup";

// Service Details Schema
export const serviceDetailsSchema = yup.object().shape({
  serviceTitle: yup
    .string()
    .required("Service title is required")
    .max(50, "Service title must be at most 50 characters")
    .test("serviceTitle-validation", "Service title must be at most 50 characters", function(value) {
      if (!value || value.trim() === "") return false;
      return value.length <= 50;
    }),
  whatsIncluded: yup
    .string()
    .nullable()
    .notRequired()
    .transform((value) => (value === "" || value === null || value === undefined ? null : value))
    .max(150, "Description must be at most 150 characters")
    .test("whatsIncluded-validation", "Description must be at most 150 characters", function(value) {
      if (!value || value === null || value === undefined || value.trim() === "") return true;
      return value.length <= 150;
    }),
  servicePrice: yup
    .string()
    .nullable()
    .notRequired()
    .transform((value) => (value === "" || value === null || value === undefined ? null : value))
    .test("price-format", "Price must be a valid number (e.g., 120 or $99.99)", function(value) {
      if (!value || value === null || value === undefined || value.trim() === "") return true; // Allow empty values
      // Allow numbers with optional decimal and optional $ symbol at start
      const trimmedValue = value.trim();
      const priceRegex = /^\$?\d+(\.\d{0,2})?$/;
      return priceRegex.test(trimmedValue);
    }),
  responseTime: yup
    .string()
    .nullable()
    .notRequired()
    .oneOf(["within_1_hour", "within_few_hours", "same_day", "within_24_hours", "within_48_hours", "flexible", "no_response_time", null, ""], "Invalid response time value")
    .transform((value) => {
      // Convert "no_response_time" or empty values to null
      if (value === "no_response_time" || value === "" || value === null || value === undefined) {
        return null;
      }
      return value;
    }),
});

// Quick Contact Schema (all fields optional)
export const quickContactSchema = yup.object().shape({
  fullName: yup
    .string()
    .max(100, "Full name must be at most 100 characters")
    .test("fullName-validation", "Full name must be at most 100 characters", function(value) {
      if (!value || value.trim() === "") return true;
      return value.length <= 100;
    }),
  email: yup
    .string()
    .test("email-format", "Must be a valid email format", function(value) {
      if (!value || value.trim() === "") return true;
      return yup.string().email().isValidSync(value);
    }),
  phoneNumber: yup
    .string()
    .max(15, "Phone number must be at most 15 characters")
    .test("phoneNumber-validation", "Phone number must be at most 15 characters", function(value) {
      if (!value || value.trim() === "") return true;
      return value.length <= 15;
    }),
});

// Contact Info Schema (all fields optional)
export const contactInfoSchema = yup.object().shape({
  fullName: yup
    .string()
    .max(100, "Full name must be at most 100 characters")
    .test("fullName-validation", "Full name must be at most 100 characters", function(value) {
      if (!value || value.trim() === "") return true;
      return value.length <= 100;
    }),
  email: yup
    .string()
    .test("email-format", "Must be a valid email format", function(value) {
      if (!value || value.trim() === "") return true;
      return yup.string().email().isValidSync(value);
    }),
  phoneNumber: yup
    .string()
    .max(15, "Phone number must be at most 15 characters")
    .test("phoneNumber-validation", "Phone number must be at most 15 characters", function(value) {
      if (!value || value.trim() === "") return true;
      return value.length <= 15;
    }),
});

// Custom Question Schema
export const customQuestionSchema = yup.object().shape({
  question: yup
    .string()
    .required("Question is required")
    .max(200, "Question must be at most 200 characters"),
  answerType: yup
    .string()
    .required("Answer type is required"),
  options: yup
    .array()
    .of(yup.string())
    .test("options-validation", "At least two options are required for dropdown/multichoice", function(value) {
      const { answerType } = this.parent;
      if (answerType === "single_choice" || answerType === "multiselect") {
        if (!value || value.length === 0) return false;
        // Filter out empty options and check if at least 2 have values
        const validOptions = value.filter((opt: string | undefined) => opt && opt.trim() !== "");
        return validOptions.length >= 2;
      }
      return true;
    }),
});


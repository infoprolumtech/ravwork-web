import * as yup from "yup";

export const profileEditSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email format"),
  countryCode: yup
    .string()
    .required("Country code is required")
    .test("country-code-format", "Country code must start with +", function(value) {
      return value ? value.startsWith("+") : false;
    }),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d+$/, "Phone number must contain only digits")
    .min(7, "Phone number must be at least 7 digits")
    .max(15, "Phone number must be at most 15 digits"),
  displayName: yup
    .string()
    .required("Display name is required")
    .max(100, "Display name must be at most 100 characters")
    .test("displayName-validation", "Display name must be at most 100 characters", function(value) {
      if (!value || value.trim() === "") return false;
      return value.length <= 100;
    }),
  businessDescription: yup
    .string()
    .max(250, "Business description must be at most 250 characters")
    .test("businessDescription-validation", "Business description must be at most 250 characters", function(value) {
      // Only validate if value is provided
      if (!value || value.trim() === "") return true;
      return value.length <= 250;
    }),
  profilePhoto: yup.mixed().notRequired(), // Always optional, no validation
  instagramUrl: yup
    .string()
    .test("instagram-url", "Must be a valid URL", function(value) {
      // Only validate if value is provided
      if (!value || value.trim() === "") return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }),
  facebookUrl: yup
    .string()
    .test("facebook-url", "Must be a valid URL", function(value) {
      // Only validate if value is provided
      if (!value || value.trim() === "") return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }),
  linkedinUrl: yup
    .string()
    .test("linkedin-url", "Must be a valid URL", function(value) {
      // Only validate if value is provided
      if (!value || value.trim() === "") return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }),
});

export type ProfileEditFormInputs = yup.InferType<typeof profileEditSchema>;


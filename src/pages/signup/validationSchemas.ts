import * as yup from "yup";

export const step1Schema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .test("username-after-prefix", "Username is required", function(value) {
      const PREFIX = "ravwork.link/";
      if (!value) return false;
      // Check if value is longer than just the prefix
      const usernameWithoutPrefix = value.replace(PREFIX, "");
      return usernameWithoutPrefix.length > 0;
    })
    .test("username-length", "Username must be between 3 and 50 characters", function(value) {
      const PREFIX = "ravwork.link/";
      if (!value) return false;
      const usernameWithoutPrefix = value.replace(PREFIX, "");
      return usernameWithoutPrefix.length >= 3 && usernameWithoutPrefix.length <= 50;
    })
    .test("username-format", "Alphanumeric and underscores, must start with letter", function(value) {
      const PREFIX = "ravwork.link/";
      if (!value) return false;
      const usernameWithoutPrefix = value.replace(PREFIX, "");
      if (usernameWithoutPrefix.length === 0) return true; // Length validation will catch empty
      // Must start with letter
      if (!/^[a-zA-Z]/.test(usernameWithoutPrefix)) {
        return this.createError({
          message: "Alphanumeric and underscores, must start with letter",
        });
      }
      // Only alphanumeric and underscores
      if (!/^[a-zA-Z0-9_]+$/.test(usernameWithoutPrefix)) {
        return this.createError({
          message: "Alphanumeric and underscores, must start with letter",
        });
      }
      return true;
    }),
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
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(15, "Password must be at most 15 characters")
    .test("password-uppercase", "Password must contain at least one uppercase letter", function(value) {
      return value ? /[A-Z]/.test(value) : false;
    })
    .test("password-lowercase", "Password must contain at least one lowercase letter", function(value) {
      return value ? /[a-z]/.test(value) : false;
    })
    .test("password-number", "Password must contain at least one number", function(value) {
      return value ? /\d/.test(value) : false;
    })
    .test("password-special", "Password must contain at least one special character", function(value) {
      return value ? /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) : false;
    }),
});

export const step2Schema = yup.object().shape({
  plan: yup.string().required("Please select a plan"),
});

// Step 3 is currently not used in the active flow, but kept for future use.
export const step3Schema = yup.object().shape({
  paymentProvider: yup.string().required("Payment provider is required"),
});

export const step4Schema = yup.object().shape({
  businessName: yup
    .string()
    .max(100, "Business name must be at most 100 characters")
    .test("businessName-validation", "Business name must be at most 100 characters", function(value) {
      // Only validate if value is provided
      if (!value || value.trim() === "") return true;
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
  profileImage: yup.mixed().notRequired(), // Always optional, no validation
  instagram: yup
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
  facebook: yup
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
  linkedin: yup
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


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

export const step3Schema = yup.object().shape({
  paymentMethod: yup.string(),
  cardNumber: yup
    .string()
    .test("card-number-required", "Card number is required when entering card details", function(value) {
      const { paymentMethod, expiryDate, securityCode } = this.parent;
      // If payment method is set (apple or link), card number is not required
      if (paymentMethod === "apple" || paymentMethod === "link") return true;
      // If any card field is filled, all must be filled
      if (expiryDate || securityCode) {
        return Boolean(value && value.trim().length > 0);
      }
      return true;
    })
    .test("card-number-format", "Card number must be 13-19 digits", function(value) {
      const { paymentMethod } = this.parent;
      // Skip validation if payment method is apple or link
      if (paymentMethod === "apple" || paymentMethod === "link") return true;
      // Skip if card number is not provided (will be caught by required test)
      if (!value || value.trim().length === 0) return true;
      // Remove spaces and dashes, then check if it's all digits
      const cleaned = value.replace(/[\s-]/g, "");
      return /^\d{13,19}$/.test(cleaned);
    }),
  expiryDate: yup
    .string()
    .test("expiry-date-required", "Expiry date is required when entering card details", function(value) {
      const { paymentMethod, cardNumber, securityCode } = this.parent;
      // If payment method is set (apple or link), expiry date is not required
      if (paymentMethod === "apple" || paymentMethod === "link") return true;
      // If any card field is filled, all must be filled
      if (cardNumber || securityCode) {
        return Boolean(value && value.trim().length > 0);
      }
      return true;
    })
    .test("expiry-date-format", "Expiry date must be in MM/YY or MM/YYYY format", function(value) {
      const { paymentMethod } = this.parent;
      // Skip validation if payment method is apple or link
      if (paymentMethod === "apple" || paymentMethod === "link") return true;
      // Skip if expiry date is not provided (will be caught by required test)
      if (!value || value.trim().length === 0) return true;
      // Check MM/YY or MM/YYYY format
      const mmYYPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
      const mmYYYYPattern = /^(0[1-9]|1[0-2])\/\d{4}$/;
      return mmYYPattern.test(value) || mmYYYYPattern.test(value);
    })
    .test("expiry-date-valid", "Expiry date must be in the future", function(value) {
      const { paymentMethod } = this.parent;
      // Skip validation if payment method is apple or link
      if (paymentMethod === "apple" || paymentMethod === "link") return true;
      // Skip if expiry date is not provided or format is invalid
      if (!value || value.trim().length === 0) return true;
      const mmYYPattern = /^(0[1-9]|1[0-2])\/(\d{2})$/;
      const mmYYYYPattern = /^(0[1-9]|1[0-2])\/(\d{4})$/;
      
      let month: number, year: number;
      if (mmYYPattern.test(value)) {
        const match = value.match(mmYYPattern);
        if (!match) return true;
        month = parseInt(match[1], 10);
        year = 2000 + parseInt(match[2], 10);
      } else if (mmYYYYPattern.test(value)) {
        const match = value.match(mmYYYYPattern);
        if (!match) return true;
        month = parseInt(match[1], 10);
        year = parseInt(match[2], 10);
      } else {
        return true; // Format validation will catch this
      }
      
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      
      if (year > currentYear) return true;
      if (year === currentYear && month >= currentMonth) return true;
      return false;
    }),
  securityCode: yup
    .string()
    .test("security-code-required", "Security code is required when entering card details", function(value) {
      const { paymentMethod, cardNumber, expiryDate } = this.parent;
      // If payment method is set (apple or link), security code is not required
      if (paymentMethod === "apple" || paymentMethod === "link") return true;
      // If any card field is filled, all must be filled
      if (cardNumber || expiryDate) {
        return Boolean(value && value.trim().length > 0);
      }
      return true;
    })
    .test("security-code-format", "Security code must be 3-4 digits", function(value) {
      const { paymentMethod } = this.parent;
      // Skip validation if payment method is apple or link
      if (paymentMethod === "apple" || paymentMethod === "link") return true;
      // Skip if security code is not provided (will be caught by required test)
      if (!value || value.trim().length === 0) return true;
      // Check if it's 3-4 digits
      return /^\d{3,4}$/.test(value);
    }),
}).test("payment-method-or-card", "Please select a payment method or enter card details", function(value) {
  const { paymentMethod, cardNumber, expiryDate, securityCode } = value;
  // If payment method is set (apple, link, or card), it's valid
  if (paymentMethod) return true;
  // If all card details are provided, it's valid (we'll set paymentMethod to "card" in the handler)
  if (cardNumber && expiryDate && securityCode) return true;
  // Otherwise, invalid - attach error to paymentMethod field
  return this.createError({
    path: "paymentMethod",
    message: "Please select a payment method or enter card details",
  });
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


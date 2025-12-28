import * as yup from "yup";

export const step1Schema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .test("username-after-prefix", "Username is required", function(value) {
      const PREFIX = "ravwork.link/";
      if (!value) return false;
      // Check if value is longer than just the prefix
      return value.length > PREFIX.length;
    }),
  email: yup.string().email("Must be a valid email format").required("Email is required"),
  phone: yup.string().required("Phone number is required").min(10, "Phone number must be at least 10 digits"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const step2Schema = yup.object().shape({
  plan: yup.string().required("Please select a plan"),
});

export const step3Schema = yup.object().shape({
  paymentMethod: yup.string(),
  cardNumber: yup.string(),
  expiryDate: yup.string(),
  securityCode: yup.string(),
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
  businessName: yup.string().required("Business name is required"),
  businessDescription: yup.string().required("Business description is required"),
});


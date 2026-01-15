import * as yup from "yup";
import type { TestContext } from "yup";

// Schema for contact info form (used in booking - description not required)
export const contactInfoSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters"),
  email: yup
    .string()
    .notRequired()
    .test("email-format", "Must be a valid email format", function(value) {
      if (!value || value.trim() === "") return true;
      return yup.string().email().isValidSync(value);
    }),
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
    .notRequired()
    .test("email-format", "Must be a valid email format", function(value) {
      if (!value || value.trim() === "") return true;
      return yup.string().email().isValidSync(value);
    }),
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
    let fieldSchema: any;
    
    // Handle textarea fields with string validation for better max length support
    if (field.fieldType === "textarea") {
      if (field.isRequired) {
        fieldSchema = yup
          .string()
          .required(`${field.label} is required`)
          .max(250, "Maximum 250 characters allowed");
      } else {
        fieldSchema = yup
          .string()
          .notRequired()
          .test("max-length", "Maximum 250 characters allowed", function(value: any) {
            if (!value || value === "") {
              return true; // Empty values are valid for non-required fields
            }
            return (value as string).length <= 250;
          });
      }
    } else if (field.fieldType === "file" || field.fieldType === "images") {
      // Handle file/image upload fields - support multiple images (array)
      if (field.isRequired) {
        fieldSchema = yup
          .array()
          .of(yup.string())
          .required(`${field.label} is required`)
          .min(1, `${field.label} requires at least 1 image`)
          .max(10, `${field.label} allows maximum 10 images`)
          .test("not-empty-array", `${field.label} requires at least 1 image`, function(value: any) {
            return Array.isArray(value) && value.length > 0 && value.every((url: any) => url && url !== "");
          });
      } else {
        fieldSchema = yup
          .array()
          .of(yup.string())
          .notRequired()
          .max(10, `${field.label} allows maximum 10 images`)
          .test("valid-urls", "All image URLs must be valid", function(value: any) {
            if (!value || !Array.isArray(value) || value.length === 0) {
              return true; // Empty is valid for non-required fields
            }
            return value.every((url: any) => url && url !== "");
          });
      }
    } else if (field.fieldType === "text" && !field.options) {
      // Handle text fields (not radio/select) with string validation for max length support
      if (field.isRequired) {
        fieldSchema = yup
          .string()
          .required(`${field.label} is required`)
          .max(100, "Maximum 100 characters allowed");
      } else {
        fieldSchema = yup
          .string()
          .nullable()
          .transform((value) => (value === "" ? null : value))
          .notRequired()
          .test("max-length", "Maximum 100 characters allowed", function(value: any) {
            if (!value || value === null || value === "") {
              return true; // Empty values are valid for non-required fields
            }
            return (value as string).length <= 100;
          });
      }
    } else if (field.isRequired) {
      fieldSchema = yup
        .mixed()
        .required(`${field.label} is required`)
        .test("not-empty", `${field.label} is required`, function(value: any) {
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
      fieldSchema = yup.mixed().notRequired();
    }
    
    // Add date validation: date must not be in the past, and time must be greater than current time if date is today
    if (field.fieldType === "date") {
      fieldSchema = fieldSchema.test(
        "not-past-date-time",
        "Date cannot be in the past. For today's date, time must be greater than the current time.",
        function(value: any) {
          // If not required, allow empty, partial (date only or time only), or both
          if (!field.isRequired) {
            if (!value || (!value.date && !value.time)) {
              return true; // Empty is valid for non-required
            }
            // If only date is provided (no time), validate date only
            if (value.date && !value.time) {
              const selectedDate = new Date(value.date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              selectedDate.setHours(0, 0, 0, 0);
              return selectedDate >= today; // Date must not be in the past
            }
            // If only time is provided (no date), validate time only (must be future)
            if (value.time && !value.date) {
              const [hours, minutes] = (value.time as string).split(":").map(Number);
              const selectedTime = new Date();
              selectedTime.setHours(hours, minutes, 0, 0);
              const now = new Date();
              return selectedTime.getTime() > now.getTime();
            }
          }
          
          // For required fields, both date and time must be present
          if (!value || (!value.date && !value.time)) {
            return false;
          }
          
          const { date, time } = value;
          if (!date || !time) {
            return false; // Both required for required fields
          }
          
          const selectedDate = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          selectedDate.setHours(0, 0, 0, 0);
          
          if (selectedDate < today) {
            return false; // Date is in the past
          }
          
          if (selectedDate.getTime() === today.getTime()) {
            const [hours, minutes] = (time as string).split(":").map(Number);
            const selectedTime = new Date();
            selectedTime.setHours(hours, minutes, 0, 0);
            const now = new Date();
            
            // Time must be strictly greater than current time (not equal to)
            return selectedTime.getTime() > now.getTime();
          }
          return true; // Date is in the future
        }
      );
    }
    
    // Add time validation: time must not be in the past if date is today
    if (field.fieldType === "time") {
      fieldSchema = fieldSchema.test(
        "not-past-time",
        "Time cannot be in the past. Please select a future time.",
        function(this: TestContext<any>, value: any) {
          if (!value || value === "") {
            return !field.isRequired; // If not required and empty, it's valid
          }
          
          // Check if there's a corresponding date field
          // Find the date field that appears before this time field (assuming they're related)
          const currentFieldIndex = formFields.findIndex(f => f.id === field.id);
          const relatedDateField = formFields
            .slice(0, currentFieldIndex)
            .reverse()
            .find(f => f.fieldType === "date");
          
          if (relatedDateField) {
            const dateValue = this.parent[relatedDateField.id];
            if (dateValue) {
              const selectedDate = new Date(dateValue);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              selectedDate.setHours(0, 0, 0, 0);
              
              // If date is today, check if time is in the past
              if (selectedDate.getTime() === today.getTime()) {
                const [hours, minutes] = (value as string).split(":").map(Number);
                const selectedTime = new Date();
                selectedTime.setHours(hours, minutes, 0, 0);
                const now = new Date();
                
                return selectedTime > now;
              }
              // If date is in the future, any time is valid
              return true;
            }
          }
          
          // If no date field found, validate against current time
          const [hours, minutes] = (value as string).split(":").map(Number);
          const selectedTime = new Date();
          selectedTime.setHours(hours, minutes, 0, 0);
          const now = new Date();
          
          return selectedTime > now;
        }
      );
    }
    
    // Add date_time validation: date must not be in the past, and time must be greater than current time if date is today
    if (field.fieldType === "date_time") {
      fieldSchema = fieldSchema.test(
        "not-past-date-time",
        "Date cannot be in the past. For today's date, time must be greater than the current time.",
        function(value: any) {
          // If not required, allow empty, partial (date only or time only), or both
          if (!field.isRequired) {
            if (!value || (!value.date && !value.time)) {
              return true; // Empty is valid for non-required
            }
            // If only date is provided (no time), validate date only
            if (value.date && !value.time) {
              const selectedDate = new Date(value.date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              selectedDate.setHours(0, 0, 0, 0);
              return selectedDate >= today; // Date must not be in the past
            }
            // If only time is provided (no date), validate time only (must be future)
            if (value.time && !value.date) {
              const [hours, minutes] = (value.time as string).split(":").map(Number);
              const selectedTime = new Date();
              selectedTime.setHours(hours, minutes, 0, 0);
              const now = new Date();
              return selectedTime.getTime() > now.getTime();
            }
          }
          
          // For required fields, both date and time must be present
          if (!value || (!value.date && !value.time)) {
            return false;
          }
          
          const { date, time } = value;
          if (!date || !time) {
            return false; // Both required for required fields
          }
          
          const selectedDate = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          selectedDate.setHours(0, 0, 0, 0);
          
          if (selectedDate < today) {
            return false; // Date is in the past
          }
          
          if (selectedDate.getTime() === today.getTime()) {
            const [hours, minutes] = (time as string).split(":").map(Number);
            const selectedTime = new Date();
            selectedTime.setHours(hours, minutes, 0, 0);
            const now = new Date();
            
            // Time must be strictly greater than current time (not equal to)
            return selectedTime.getTime() > now.getTime();
          }
          return true; // Date is in the future
        }
      );
    }
    
    schemaShape[field.id] = fieldSchema;
  });
  
  return yup.object().shape(schemaShape);
};


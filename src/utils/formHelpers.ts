import type { PublicService, FormFieldResponse } from "../rtk/endpoints/publicApi";

interface FormFieldValues {
    [key: string]: string | string[] | { date?: string; time?: string };
}

export const transformFormResponses = (
    formFieldValues: FormFieldValues,
    selectedService: PublicService | null
): FormFieldResponse[] => {
    if (!selectedService) return [];

    return Object.entries(formFieldValues)
        .filter(([fieldId, value]) => {
            // Filter out empty strings, null, undefined, and empty arrays
            if (value === null || value === undefined) return false;
            if (typeof value === "string" && value.trim() === "") return false;
            if (Array.isArray(value) && value.length === 0) return false;

            // For date_time fields, check if at least one value is present (for non-required fields)
            // or both are present (for required fields)
            if (typeof value === "object" && !Array.isArray(value)) {
                const dateTimeValue = value as { date?: string; time?: string };
                const field = selectedService.formFields?.find((f) => f.id === fieldId);

                // If field is required, both date and time must be present
                if (field?.isRequired) {
                    return !!(dateTimeValue.date && dateTimeValue.time && dateTimeValue.date !== "" && dateTimeValue.time !== "");
                }

                // If field is not required, allow if at least one is present
                return !!((dateTimeValue.date && dateTimeValue.date !== "") || (dateTimeValue.time && dateTimeValue.time !== ""));
            }
            return true;
        })
        .map(([fieldId, value]) => {
            const field = selectedService.formFields?.find((f) => f.id === fieldId);

            // Handle date field (includes both date and time) or date_time (legacy)
            if (
                (field?.fieldType === "date" || field?.fieldType === "date_time") &&
                typeof value === "object" &&
                !Array.isArray(value)
            ) {
                const dateTimeValue = value as { date?: string; time?: string };

                // If both date and time are present, combine them
                if (dateTimeValue.date && dateTimeValue.time) {
                    return {
                        fieldId,
                        value: `${dateTimeValue.date}T${dateTimeValue.time}:00`,
                    };
                }

                // If only date is present
                if (dateTimeValue.date) {
                    return { fieldId, value: dateTimeValue.date };
                }

                // If only time is present
                if (dateTimeValue.time) {
                    return { fieldId, value: dateTimeValue.time };
                }
            }

            return {
                fieldId,
                value: value as string | string[],
            };
        });
};

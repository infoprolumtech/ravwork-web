import { useEffect } from "react";
import { Box, Button, Typography, InputAdornment, Stack, Grid, IconButton } from "@mui/material";
import Icon from "../shared/Icon";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StyledTextField } from "../../utils/helper";
import { ProgressIndicator } from "./ProgressIndicator";
import { step3Schema } from "../../pages/signup/validationSchemas";
import type { Step3FormInputs } from "../../pages/signup/types";
import PageIcon from "../shared/PageIcon";
import { pageTitleSx, bottomButtonContainerSx, backIconButtonSx, iconButtonSx, helperTextSx } from "./commonStyles";

interface Step3Props {
  onNext: (data: Step3FormInputs) => void;
  initialData?: Step3FormInputs | null;
  onBack?: () => void;
}

export const Step3 = ({ onNext, initialData, onBack }: Step3Props) => {
  const form = useForm<Step3FormInputs>({
    resolver: yupResolver(step3Schema) as any,
    mode: "onChange", // Validate on change (while typing)
    defaultValues: initialData || { paymentMethod: "", cardNumber: "", expiryDate: "", securityCode: "" },
  });

  // Update form values when initialData changes (when navigating back)
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = (data: Step3FormInputs) => {
    // If card details are provided but paymentMethod is not set, set it to "card"
    if (!data.paymentMethod && data.cardNumber && data.expiryDate && data.securityCode) {
      data.paymentMethod = "card";
    }
    onNext(data);
  };

  const handleBackClick = () => {
    // Use parent's navigation handler to stay within signup flow
    if (onBack) {
      onBack();
    }
  };

  return (
    <Box width="100%" maxWidth={{ xs: "100%", sm: "527px" }} component="form" onSubmit={form.handleSubmit(handleSubmit)} sx={{ mx: "auto", position: "relative" }}>
      {/* Back Icon - Above progress bar for large screens */}
      <Box sx={backIconButtonSx}>
        <IconButton onClick={handleBackClick} sx={iconButtonSx}>
          <Icon src="/assets/icons/back-arrow.svg" alt="back-arrow" size={24} />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mb: { xs: 2, sm: 3 } }}>
        <ProgressIndicator currentStep={3} />
      </Box>

      {/* Icon above title */}
      <PageIcon iconSrc="/assets/icons/paymnet_icon.svg" iconAlt="icon" />

      <Typography variant="h5" textAlign="center" mb={{ xs: 2, sm: 3 }} sx={pageTitleSx}>
        Payment Method
      </Typography>

      <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            border: form.formState.errors.paymentMethod ? "1px solid #DC2626" : "1px solid #D1D5DB",
            py: { xs: 1.5, sm: 2 },
            textTransform: "none",
            color: "#111927",
            backgroundColor: form.watch("paymentMethod") === "apple" ? "#E5ECF6" : "#F7F9FB",
            "&:hover": {
              borderColor: form.formState.errors.paymentMethod ? "#DC2626" : "#9CA3AF",
              backgroundColor: form.watch("paymentMethod") === "apple" ? "#D1E7F0" : "white"
            },
            minHeight: { xs: "48px", sm: "56px" },
          }}
          onClick={() => {
            form.setValue("paymentMethod", "apple", { shouldValidate: true });
            form.clearErrors("paymentMethod");
          }}
        >
          <Icon src="/assets/icons/apple-pay 1.svg" alt="apple-pay" size={22} sx={{ width: "53px", height: "21px", maxWidth: "100%" }} />
        </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            border: form.formState.errors.paymentMethod ? "1px solid #DC2626" : "1px solid #D1D5DB",
            background: form.watch("paymentMethod") === "link" ? "#E5ECF6" : "#F7F9FB",
            py: { xs: 1.5, sm: 2 },
            textTransform: "none",
            "&:hover": {
              borderColor: form.formState.errors.paymentMethod ? "#DC2626" : "#9CA3AF",
              backgroundColor: form.watch("paymentMethod") === "link" ? "#D1E7F0" : "white"
            },
            minHeight: { xs: "48px", sm: "56px" },
          }}
          onClick={() => {
            form.setValue("paymentMethod", "link", { shouldValidate: true });
            form.clearErrors("paymentMethod");
          }}
        >
          <Icon src="/assets/icons/Link_idHNoUBT0y_1 1.svg" alt="link" size={22} sx={{ width: "53px", height: "21px", maxWidth: "100%" }} />
        </Button>

      </Stack>

      <Box sx={{ display: "flex", mt: -1 }}>
        <Icon src="/assets/icons/line2.svg" alt="divider" sx={{ width: "23px" }} />
      </Box>

      {(form.formState.errors.root || form.formState.errors.paymentMethod) && (
        <Box sx={{ mb: 1.5, mt: -1 }}>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "#FF1100",
              textAlign: "center",
              ...helperTextSx,
            }}
          >
            {form.formState.errors.paymentMethod?.message || form.formState.errors.root?.message}
          </Typography>
        </Box>
      )}



      <StyledTextField
        fullWidth
        variant="outlined"
        placeholder="Card Number"
        margin="normal"
        {...form.register("cardNumber", {
          onChange: (e) => {
            if (e.target.value && !form.getValues("paymentMethod")) {
              form.setValue("paymentMethod", "card", { shouldValidate: true });
              form.clearErrors("paymentMethod");
            }
            form.trigger("cardNumber");
          },
        })}
        error={Boolean(form.formState.errors.cardNumber)}
        helperText={form.formState.errors.cardNumber?.message}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Stack direction="row" spacing={{ xs: 0.25, sm: 0.5 }} alignItems="center">
                  <Icon src="/assets/icons/mastercard.svg" alt="mastercard" size={28} />
                  <Icon src="/assets/icons/visa_icon.svg" alt="visa" size={28} />
                  <Icon src="/assets/icons/american_express.svg" alt="american-express" size={28} />
                </Stack>
              </InputAdornment>
            ),
          },
        }}
      />

      <Grid container spacing={{ xs: 0, sm: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="Expiry Date"
            margin="normal"
            {...form.register("expiryDate", {
              onChange: (e) => {
                if (e.target.value && !form.getValues("paymentMethod")) {
                  form.setValue("paymentMethod", "card", { shouldValidate: true });
                  form.clearErrors("paymentMethod");
                }
                form.trigger("expiryDate");
              },
            })}
            error={Boolean(form.formState.errors.expiryDate)}
            helperText={form.formState.errors.expiryDate?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="Security Code"
            margin="normal"
            {...form.register("securityCode", {
              onChange: (e) => {
                if (e.target.value && !form.getValues("paymentMethod")) {
                  form.setValue("paymentMethod", "card", { shouldValidate: true });
                  form.clearErrors("paymentMethod");
                }
                form.trigger("securityCode");
              },
            })}
            error={Boolean(form.formState.errors.securityCode)}
            helperText={form.formState.errors.securityCode?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Icon src="/assets/icons/credit-card.svg" alt="security" size={24} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
      </Grid>

      <Box sx={bottomButtonContainerSx}>
        <Button
          fullWidth
          type="submit"
          variant="secondary"
          sx={{
            mt: { xs: 0, sm: 3 },
            height: { xs: "44px", sm: "48px" },
            cursor: form.formState.isSubmitting || !form.formState.isValid ? "not-allowed" : "pointer",
          }}
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};


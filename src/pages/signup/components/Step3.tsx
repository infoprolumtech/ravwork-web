import { Box, Button, Typography, InputAdornment, Stack, Grid, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StyledTextField } from "../../../utils/helper";
import { ProgressIndicator } from "./ProgressIndicator";
import { step3Schema } from "../validationSchemas";
import type { Step3FormInputs } from "../types";

interface Step3Props {
  onNext: (data: Step3FormInputs) => void;
  onBack: () => void;
}

export const Step3 = ({ onNext, onBack }: Step3Props) => {
  const form = useForm<Step3FormInputs>({
    resolver: yupResolver(step3Schema) as any,
    defaultValues: { paymentMethod: "", cardNumber: "", expiryDate: "", securityCode: "" },
  });

  const handleSubmit = (data: Step3FormInputs) => {
    // If card details are provided but paymentMethod is not set, set it to "card"
    if (!data.paymentMethod && data.cardNumber && data.expiryDate && data.securityCode) {
      data.paymentMethod = "card";
    }
    onNext(data);
  };

  return (
    <Box width="100%" maxWidth={527} component="form" onSubmit={form.handleSubmit(handleSubmit)}>
      {/* Back Icon - Before Progress Bar */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <IconButton
          onClick={onBack}
          sx={{
            color: "text.primary",
            p: 1,
          }}
        >
          <img
            src="/assets/icons/back-arrow.svg"
            alt="back-arrow"
            style={{ width: 24, height: 24 }}
          />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <ProgressIndicator currentStep={3} />
      </Box>
      
      {/* Icon above title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6.864px",
          }}
        >
          <img
            src="/assets/icons/paymnet_icon.svg"
            alt="icon"
            style={{ width: "36px", height: "36px" }}
          />
        </Box>
      </Box>
      
      <Typography variant="h5" textAlign="center" mb={3} sx={{ fontSize: "34px", color: "#1C1C1C", fontWeight: 600, textAlign: "center" }}>
        Payment Method
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            border: "1px solid #D1D5DB",
           
            py: 2,
            textTransform: "none",
            color: "#111927",
            backgroundColor: "#F7F9FB",
            "&:hover": { borderColor: "#9CA3AF", backgroundColor: "white" },
          }}
          onClick={() => form.setValue("paymentMethod", "apple")}
        >
          <img
            src="/assets/icons/apple-pay 1.svg"
            alt="apple-pay"
            style={{ width: "53.521px", height: "21.944px" }}
          />
        </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            border: "1px solid #D1D5DB",
            background: "#F7F9FB",
            py: 2,
            textTransform: "none",
            "&:hover": { borderColor: "#9CA3AF", backgroundColor: "white" },
          }}
          onClick={() => form.setValue("paymentMethod", "link")}
        >
          <img
            src="/assets/icons/Link_idHNoUBT0y_1 1.svg"
            alt="link"
            style={{ width: "53.521px", height: "21.944px" }}
          />
        </Button>
      </Stack>

      {form.formState.errors.root && (
        <Typography variant="caption" color="error" sx={{ mb: 1, display: "block" }}>
          {form.formState.errors.root.message}
        </Typography>
      )}
      {form.formState.errors.paymentMethod && (
        <Typography variant="caption" color="error" sx={{ mb: 1, display: "block" }}>
          {form.formState.errors.paymentMethod.message}
        </Typography>
      )}



      <StyledTextField
        fullWidth
        variant="outlined"
        placeholder="Card Number"
        margin="normal"
        {...form.register("cardNumber", {
          onChange: (e) => {
            if (e.target.value && !form.getValues("paymentMethod")) {
              form.setValue("paymentMethod", "card");
            }
          },
        })}
        error={Boolean(form.formState.errors.cardNumber)}
        helperText={form.formState.errors.cardNumber?.message}
        sx={{
          "& .MuiInputBase-input": {
            color: "#1C1C1C",
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#1C1C1C",
            opacity: 1,
          },
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <img
                    src="/assets/icons/mastercard.svg"
                    alt="mastercard"
                    style={{ width: "32px", height: "32px" }}
                  />
                  <img
                    src="/assets/icons/visa_icon.svg"
                    alt="visa"
                    style={{ width: "32px", height: "32px" }}
                  />
                  <img
                    src="/assets/icons/american_express.svg"
                    alt="american-express"
                    style={{ width: "32px", height: "32px" }}
                  />
                </Stack>
              </InputAdornment>
            ),
          },
        }}
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="Expiry Date"
            margin="normal"
            {...form.register("expiryDate", {
              onChange: (e) => {
                if (e.target.value && !form.getValues("paymentMethod")) {
                  form.setValue("paymentMethod", "card");
                }
              },
            })}
            error={Boolean(form.formState.errors.expiryDate)}
            helperText={form.formState.errors.expiryDate?.message}
            sx={{
              "& .MuiInputBase-input": {
                color: "#1C1C1C",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#1C1C1C",
                opacity: 1,
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="Security Code"
            margin="normal"
            {...form.register("securityCode", {
              onChange: (e) => {
                if (e.target.value && !form.getValues("paymentMethod")) {
                  form.setValue("paymentMethod", "card");
                }
              },
            })}
            error={Boolean(form.formState.errors.securityCode)}
            helperText={form.formState.errors.securityCode?.message}
            sx={{
              "& .MuiInputBase-input": {
                color: "#1C1C1C",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#1C1C1C",
                opacity: 1,
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <img src="/assets/icons/credit-card.svg" alt="security" style={{ width: "24px", height: "24px" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
      </Grid>

      <Button fullWidth type="submit" variant="secondary" sx={{ mt: 3 }} disabled={form.formState.isSubmitting}>
        Next
      </Button>
    </Box>
  );
};


import { useEffect } from "react";
import { Box, Button, Typography, InputAdornment, Stack, Grid, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { StyledTextField } from "../../../utils/helper";
import { ProgressIndicator } from "./ProgressIndicator";
import { step3Schema } from "../validationSchemas";
import type { Step3FormInputs } from "../types";

interface Step3Props {
  onNext: (data: Step3FormInputs) => void;
  initialData?: Step3FormInputs | null;
}

export const Step3 = ({ onNext, initialData }: Step3Props) => {
  const navigate = useNavigate();
  const form = useForm<Step3FormInputs>({
    resolver: yupResolver(step3Schema) as any,
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
    navigate(-1);
  };

  return (
    <Box width="100%" maxWidth={{ xs: "100%", sm: "527px" }} component="form" onSubmit={form.handleSubmit(handleSubmit)} sx={{ mx: "auto", position: "relative" }}>
      {/* Back Icon - Above progress bar for large screens */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          mb: 2,
        }}
      >
        <IconButton
          onClick={handleBackClick}
          sx={{
            color: "text.primary",
            p: 1,
            minWidth: "auto",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/assets/icons/back-arrow.svg"
            alt="back-arrow"
            style={{ width: "24px", height: "24px" }}
          />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mb: { xs: 2, sm: 3 } }}>
        <ProgressIndicator currentStep={3} />
      </Box>
      
      {/* Icon above title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            width: { xs: 32, sm: 36 },
            height: { xs: 32, sm: 36 },
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: { xs: "5px", sm: "6.864px" },
          }}
        >
          <img
            src="/assets/icons/paymnet_icon.svg"
            alt="icon"
            style={{ width: "100%", height: "100%" }}
          />
        </Box>
      </Box>
      
      <Typography 
        variant="h5" 
        textAlign="center" 
        mb={{ xs: 2, sm: 3 }} 
        sx={{ 
          fontSize: { xs: "24px", sm: "28px", md: "34px" }, 
          color: "#1C1C1C", 
          fontWeight: 600, 
          textAlign: "center",
        }}
      >
        Payment Method
      </Typography>

      <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            border: "1px solid #D1D5DB",
            py: { xs: 1.5, sm: 2 },
            textTransform: "none",
            color: "#111927",
            backgroundColor: "#F7F9FB",
            "&:hover": { borderColor: "#9CA3AF", backgroundColor: "white" },
            minHeight: { xs: "48px", sm: "56px" },
          }}
          onClick={() => form.setValue("paymentMethod", "apple")}
        >
          <img
            src="/assets/icons/apple-pay 1.svg"
            alt="apple-pay"
            style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "22px" }}
          />
        </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            border: "1px solid #D1D5DB",
            background: "#F7F9FB",
            py: { xs: 1.5, sm: 2 },
            textTransform: "none",
            "&:hover": { borderColor: "#9CA3AF", backgroundColor: "white" },
            minHeight: { xs: "48px", sm: "56px" },
          }}
          onClick={() => form.setValue("paymentMethod", "link")}
        >
          <img
            src="/assets/icons/Link_idHNoUBT0y_1 1.svg"
            alt="link"
            style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "22px" }}
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
                <Stack direction="row" spacing={{ xs: 0.25, sm: 0.5 }} alignItems="center">
                  <img
                    src="/assets/icons/mastercard.svg"
                    alt="mastercard"
                    style={{ width: "28px", height: "28px" }}
                  />
                  <img
                    src="/assets/icons/visa_icon.svg"
                    alt="visa"
                    style={{ width: "28px", height: "28px" }}
                  />
                  <img
                    src="/assets/icons/american_express.svg"
                    alt="american-express"
                    style={{ width: "28px", height: "28px" }}
                  />
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
         <Grid size={{ xs: 12, sm: 6 }}>
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

      <Box
        sx={{
          width: "100%",
          position: { xs: "fixed", sm: "static" },
          bottom: { xs: 0, sm: "auto" },
          left: { xs: 0, sm: "auto" },
          p: { xs: 2, sm: 0 },
          backgroundColor: { xs: "#fff", sm: "transparent" },
          zIndex: { xs: 10, sm: "auto" },
          
        }}
      >
        <Button 
          fullWidth 
          type="submit" 
          variant="secondary" 
          sx={{ 
            mt: { xs: 0, sm: 3 },
            height: { xs: "44px", sm: "48px" },
          }} 
          disabled={form.formState.isSubmitting}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};


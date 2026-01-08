import { useEffect } from "react";
import { Box, Button, Typography, InputAdornment, Stack, Grid, IconButton } from "@mui/material";
import Icon from "../../../components/shared/Icon";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { StyledTextField } from "../../../utils/helper";
import { ProgressIndicator } from "./ProgressIndicator";
import { step3Schema } from "../validationSchemas";
import type { Step3FormInputs } from "../types";
import PageIcon from "../../../components/shared/PageIcon";
import { pageTitleSx, bottomButtonContainerSx, backIconButtonSx, iconButtonSx } from "./commonStyles";

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
      <Box sx={backIconButtonSx}>
        <IconButton onClick={handleBackClick} sx={iconButtonSx}>
          <Icon src="/assets/icons/back-arrow.svg" alt="back-arrow" size={24}  />
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
          <Icon src="/assets/icons/apple-pay 1.svg" alt="apple-pay" size={22} sx={{  width: "53px", height: "21px", maxWidth: "100%" }} />
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
          <Icon src="/assets/icons/Link_idHNoUBT0y_1 1.svg" alt="link" size={22} sx={{  width: "53px", height: "21px", maxWidth: "100%" }} />
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
                   form.setValue("paymentMethod", "card");
                 }
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
                   form.setValue("paymentMethod", "card");
                 }
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
          }} 
          disabled={form.formState.isSubmitting}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};


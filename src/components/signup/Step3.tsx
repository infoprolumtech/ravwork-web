import { useEffect } from "react";
import { Box, Button, Typography, IconButton, CircularProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProgressIndicator } from "./ProgressIndicator";
import { step3Schema } from "../../pages/signup/validationSchemas";
import type { Step3FormInputs } from "../../pages/signup/types";
import PageIcon from "../shared/PageIcon";
import Icon from "../shared/Icon";
import { pageTitleSx, bottomButtonContainerSx, backIconButtonSx, iconButtonSx } from "./commonStyles";

/**
 * NOTE: Step 3 is currently not part of the active signup flow (Step 2 redirects to Stripe checkout).
 * This component is intentionally kept in the codebase for future use if the flow is reintroduced.
 */

interface Step3Props {
  onNext: (data: Step3FormInputs) => void;
  initialData?: Step3FormInputs | null;
  onBack?: () => void;
  isLoading?: boolean;
}

export const Step3 = ({ onNext, initialData, onBack, isLoading = false }: Step3Props) => {
  const form = useForm<Step3FormInputs>({
    resolver: yupResolver(step3Schema) as any,
    defaultValues: initialData || { paymentProvider: "stripe" },
  });

  useEffect(() => {
    if (initialData) form.reset(initialData);
  }, [form, initialData]);

  const handleBackClick = () => {
    if (onBack) onBack();
  };

  return (
    <Box
      width="100%"
      maxWidth={{ xs: "100%", sm: "527px" }}
      component="form"
      onSubmit={form.handleSubmit(onNext)}
      sx={{ mx: "auto", position: "relative" }}
    >
      {/* Back Icon - Above progress bar for large screens */}
      <Box sx={backIconButtonSx}>
        <IconButton onClick={handleBackClick} sx={iconButtonSx}>
          <Icon src="/assets/icons/back-arrow.svg" alt="back-arrow" size={24} />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: { xs: 2, sm: 3 } }}>
        <ProgressIndicator currentStep={3} />
      </Box>

      <PageIcon iconSrc="/assets/icons/plan_icon.svg" iconAlt="icon" />

      <Typography variant="h5" textAlign="center" mb={{ xs: 1.5, sm: 2 }} sx={pageTitleSx}>
        Complete payment
      </Typography>

      {/* Keep a minimal, validated selection for future extensibility */}
      <Controller
        name="paymentProvider"
        control={form.control}
        render={({ field }) => (
          <input type="hidden" {...field} value={field.value || "stripe"} />
        )}
      />

      <Typography variant="body2" textAlign="center" sx={{ color: "#6C737F", mb: { xs: 2, sm: 3 } }}>
        You’ll be redirected to a secure checkout to complete your subscription.
      </Typography>

      <Box sx={bottomButtonContainerSx}>
        <Button
          fullWidth
          type="submit"
          variant="secondary"
          disabled={isLoading}
          sx={{
            mt: { xs: 0, sm: 3 },
            height: { xs: "44px", sm: "48px" },
          }}
        >
          {isLoading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Next"}
        </Button>
      </Box>
    </Box>
  );
};



import { useEffect } from "react";
import { Box, Button, Typography, FormControl, FormControlLabel, RadioGroup, Stack, Chip, IconButton } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProgressIndicator } from "./ProgressIndicator";
import { step2Schema } from "../validationSchemas";
import type { Step2FormInputs } from "../types";
import CheckboxIcon from "../../../components/shared/CheckboxIcon";
import PageIcon from "../../../components/shared/PageIcon";
import Icon from "../../../components/shared/Icon";
import { pageTitleSx, bottomButtonContainerSx, backIconButtonSx, iconButtonSx } from "./commonStyles";

interface Step2Props {
  onNext: (data: Step2FormInputs) => void;
  initialData?: Step2FormInputs | null;
  onBack?: () => void;
}

export const Step2 = ({ onNext, initialData, onBack }: Step2Props) => {
  const form = useForm<Step2FormInputs>({
    resolver: yupResolver(step2Schema),
    defaultValues: initialData || { plan: "" },
  });

  // Update form values when initialData changes (when navigating back)
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = (data: Step2FormInputs) => {
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
        <ProgressIndicator currentStep={2} />
      </Box>

      {/* Icon above title */}
      <PageIcon iconSrc="/assets/icons/plan_icon.svg" iconAlt="icon" />

      <Typography variant="h5" textAlign="center" mb={{ xs: 1.5, sm: 2 }} sx={pageTitleSx}>
        Select plan to activate<br />your booking link.
      </Typography>

      <Stack spacing={1} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, sm: 1 } }}>
          <Icon src="/assets/icons/Check icon.svg" alt="check" size={20} />
          <Typography variant="body2" sx={{ color: "#384250", fontSize: { xs: "14px", sm: "16px" } }}>
            Create a clean Professional Booking Page
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, sm: 1 } }}>
          <Icon src="/assets/icons/Check icon.svg" alt="check" size={20} />
          <Typography variant="body2" sx={{ color: "#384250", fontSize: { xs: "14px", sm: "16px" } }}>
            Streamline client requests & info
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ display: "flex", mt: -1.5, mb: { xs: 2, sm: 3 } }}>
        <Icon src="/assets/icons/line2.svg" alt="divider" sx={{ width: "23px" }} />
      </Box>

      <Controller
        name="plan"
        control={form.control}
        render={({ field }) => (
          <FormControl fullWidth error={Boolean(form.formState.errors.plan)}>
            <RadioGroup {...field} sx={{ gap: 2 }}>
              <FormControlLabel
                value="monthly"
                control={<Box sx={{ display: "none" }} />}
                onClick={() => field.onChange("monthly")}
                label={
                  <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", gap: 2 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      <Typography sx={{ fontSize: { xs: "16px", sm: "18px" }, fontWeight: 600 }}>Monthly</Typography>
                      <Box sx={{ display: "flex", mt: -1 }}>
                        <Icon src="/assets/icons/line2.svg" alt="divider" sx={{ width: "23px" }} />
                      </Box>
                      <Typography sx={{ fontSize: { xs: "14px", sm: "16px" }, fontWeight: 600, color: "#6C737F" }}>$15/ Month</Typography>
                    </Box>
                    <CheckboxIcon checked={field.value === "monthly"} />
                  </Box>
                }
                sx={{
                  border: "1px solid #D1D5DB",
                  borderRadius: { xs: "12px", sm: "17px" },
                  p: { xs: 1.5, sm: 2 },
                  width: "100%",
                  minHeight: { xs: "80px", sm: "91px" },
                  height: "auto",
                  margin: 0,
                  backgroundColor: "#E5ECF6",
                  "&:hover": { backgroundColor: "#E5ECF6" },
                  cursor: "pointer",
                  "& .MuiFormControlLabel-label": {
                    marginLeft: 0,
                    width: "100%",
                  },
                }}
              />

              <FormControlLabel
                value="yearly"
                control={<Box sx={{ display: "none" }} />}
                onClick={() => field.onChange("yearly")}
                label={
                  <Box sx={{ position: "relative", width: "100%" }}>
                    <Chip
                      label="Save 20%"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: { xs: -25, sm: -30 },
                        right: 0,
                        backgroundColor: "#BAEDBD",
                        borderRadius: "68px",
                        color: "#1C1C1C",
                        fontWeight: 600,
                        fontSize: { xs: "9px", sm: "10px" },
                        height: { xs: "18px", sm: "20px" },
                        zIndex: 1,
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", mt: 1, gap: 2 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Typography sx={{ fontSize: { xs: "16px", sm: "18px" }, fontWeight: 600 }}>Yearly</Typography>
                        <Box sx={{ display: "flex", mt: -1 }}>
                          <Icon src="/assets/icons/line2.svg" alt="divider" sx={{ width: "23px" }} />
                        </Box>
                        <Typography sx={{ fontSize: { xs: "14px", sm: "16px" }, fontWeight: 600, color: "#6C737F" }}>
                          $12/ Month{" "}
                          <Typography component="span" sx={{ fontSize: { xs: "12px", sm: "14px" }, fontWeight: 400, color: "#6C737F" }}>
                            Billed Annually.
                          </Typography>
                        </Typography>
                      </Box>
                      <CheckboxIcon checked={field.value === "yearly"} />
                    </Box>
                  </Box>
                }
                sx={{
                  border: "1px solid #D1D5DB",
                  borderRadius: { xs: "12px", sm: "17px" },
                  p: { xs: 1.5, sm: 2 },
                  width: "100%",
                  minHeight: { xs: "80px", sm: "91px" },
                  height: "auto",
                  margin: 0,
                  backgroundColor: "#E3F5FF",
                  "&:hover": { backgroundColor: "#E3F5FF" },
                  cursor: "pointer",
                  "& .MuiFormControlLabel-label": {
                    marginLeft: 0,
                    width: "100%",
                  },
                }}
              />
            </RadioGroup>
            {form.formState.errors.plan && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {form.formState.errors.plan.message}
              </Typography>
            )}
          </FormControl>
        )}
      />

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


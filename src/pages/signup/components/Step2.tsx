import { useEffect } from "react";
import { Box, Button, Typography, FormControl, FormControlLabel, RadioGroup, Stack, Chip, IconButton } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { ProgressIndicator } from "./ProgressIndicator";
import { step2Schema } from "../validationSchemas";
import type { Step2FormInputs } from "../types";

interface Step2Props {
  onNext: (data: Step2FormInputs) => void;
  initialData?: Step2FormInputs | null;
}

export const Step2 = ({ onNext, initialData }: Step2Props) => {
  const navigate = useNavigate();
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
        <ProgressIndicator currentStep={2} />
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
            src="/assets/icons/plan_icon.svg"
            alt="icon"
            style={{ width: "100%", height: "100%" }}
          />
        </Box>
      </Box>
      
      <Typography 
        variant="h5" 
        textAlign="center" 
        mb={{ xs: 1.5, sm: 2 }} 
        sx={{ 
          fontSize: { xs: "24px", sm: "28px", md: "34px" }, 
          color: "#1C1C1C", 
          fontWeight: 600, 
          textAlign: "center",
          lineHeight: { xs: 1.3, sm: 1.2 },
        }}
      >
        Select plan to activate<br />your booking link.
      </Typography>

      <Stack spacing={1} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, sm: 1 } }}>
          <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <img src="/assets/icons/check_icon_box.svg" alt="check-box" style={{ width: "20px", height: "20px" }} />
            <img src="/assets/icons/Check icon.svg" alt="check" style={{ width: "16px", height: "16px", position: "absolute" }} />
          </Box>
          <Typography variant="body2" sx={{ color: "#384250", fontSize: { xs: "14px", sm: "16px" } }}>
            Create a clean Professional Booking Page
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, sm: 1 } }}>
          <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <img src="/assets/icons/check_icon_box.svg" alt="check-box" style={{ width: "20px", height: "20px" }} />
            <img src="/assets/icons/Check icon.svg" alt="check" style={{ width: "16px", height: "16px", position: "absolute" }} />
          </Box>
          <Typography variant="body2" sx={{ color: "#384250", fontSize: { xs: "14px", sm: "16px" } }}>
            Streamline client requests & info
          </Typography>
        </Box>
      </Stack>

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
                      <Typography sx={{ fontSize: { xs: "14px", sm: "16px" }, fontWeight: 600, color: "#6C737F" }}>$15/ Month</Typography>
                    </Box>
                    <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <img src="/assets/icons/check_icon_box.svg" alt="check-box" style={{ width: "20px", height: "20px" }} />
                      {field.value === "monthly" && (
                        <img src="/assets/icons/Check icon.svg" alt="check" style={{ width: "16px", height: "16px", position: "absolute" }} />
                      )}
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
                        top: { xs: -20, sm: -25 },
                        right: 0,
                        backgroundColor: "#BAEDBD",
                        borderRadius: "68px",
                        color: "white",
                        fontSize: { xs: "9px", sm: "10px" },
                        height: { xs: "18px", sm: "20px" },
                        zIndex: 1,
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", mt: 1, gap: 2 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Typography sx={{ fontSize: { xs: "16px", sm: "18px" }, fontWeight: 600 }}>Yearly</Typography>
                        <Typography sx={{ fontSize: { xs: "14px", sm: "16px" }, fontWeight: 600, color: "#6C737F" }}>$12/ Month Billed Annually.</Typography>
                      </Box>
                      <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <img src="/assets/icons/check_icon_box.svg" alt="check-box" style={{ width: "20px", height: "20px" }} />
                        {field.value === "yearly" && (
                          <img src="/assets/icons/Check icon.svg" alt="check" style={{ width: "16px", height: "16px", position: "absolute" }} />
                        )}
                      </Box>
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

      <Box
        sx={{
          width: "100%",
          position: { xs: "fixed", sm: "static" },
          bottom: { xs: 0, sm: "auto" },
          left: { xs: 0, sm: "auto" },
          p: { xs: 2, sm: 0 },
          backgroundColor: { xs: "#fff", sm: "transparent" },
          zIndex: { xs: 10, sm: "auto" },
          boxShadow: {
            xs: "0 -2px 10px rgba(0,0,0,0.05)",
            sm: "none",
          },
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


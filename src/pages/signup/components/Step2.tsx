import { Box, Button, Typography, FormControl, FormControlLabel, RadioGroup, Stack, Chip, IconButton } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProgressIndicator } from "./ProgressIndicator";
import { step2Schema } from "../validationSchemas";
import type { Step2FormInputs } from "../types";

interface Step2Props {
  onNext: (data: Step2FormInputs) => void;
  onBack: () => void;
}

export const Step2 = ({ onNext, onBack }: Step2Props) => {
  const form = useForm<Step2FormInputs>({
    resolver: yupResolver(step2Schema),
    defaultValues: { plan: "" },
  });

  const handleSubmit = (data: Step2FormInputs) => {
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
        <ProgressIndicator currentStep={2} />
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
            src="/assets/icons/plan_icon.svg"
            alt="icon"
            style={{ width: "36px", height: "36px" }}
          />
        </Box>
      </Box>
      
      <Typography variant="h5" textAlign="center" mb={2} sx={{ fontSize: "34px", color: "#1C1C1C", fontWeight: 600, textAlign: "center" }}>
        Select plan to activate<br />your booking link.
      </Typography>

      <Stack spacing={1} sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="/assets/icons/check_icon_box.svg" alt="check-box" />
            <img src="/assets/icons/Check icon.svg" alt="check" style={{ width: "20.592px", height: "20.592px", position: "absolute" }} />
          </Box>
          <Typography variant="body2" sx={{ color: "#384250" }}>
            Create a clean Professional Booking Page
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="/assets/icons/check_icon_box.svg" alt="check-box" />
            <img src="/assets/icons/Check icon.svg" alt="check" style={{ width: "20.592px", height: "20.592px", position: "absolute" }} />
          </Box>
          <Typography variant="body2" sx={{ color: "#384250" }}>
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
                      <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>Monthly</Typography>
                      <Typography sx={{ fontSize: "16px", fontWeight: 600, color: "#6C737F" }}>$15/ Month</Typography>
                    </Box>
                    <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src="/assets/icons/check_icon_box.svg" alt="check-box" />
                      {field.value === "monthly" && (
                        <img src="/assets/icons/Check icon.svg" alt="check" style={{ width: "20.592px", height: "20.592px", position: "absolute" }} />
                      )}
                    </Box>
                  </Box>
                }
                sx={{
                  border: "1px solid #D1D5DB",
                  borderRadius: "17px",
                  p: 2,
                  width: "100%",
                  height: "91px",
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
                        top: -25,
                        right: 0,
                        backgroundColor: "#BAEDBD",
                        borderRadius: "68px",
                        color: "white",
                        fontSize: "10px",
                        height: "20px",
                        zIndex: 1,
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", mt: 1, gap: 2 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>Yearly</Typography>
                        <Typography sx={{ fontSize: "16px", fontWeight: 600, color: "#6C737F" }}>$12/ Month Billed Annually.</Typography>
                      </Box>
                      <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src="/assets/icons/check_icon_box.svg" alt="check-box" />
                        {field.value === "yearly" && (
                          <img src="/assets/icons/Check icon.svg" alt="check" style={{ width: "20.592px", height: "20.592px", position: "absolute" }} />
                        )}
                      </Box>
                    </Box>
                  </Box>
                }
                sx={{
                  border: "1px solid #D1D5DB",
                  borderRadius: "17px",
                  p: 2,
                  width: "100%",
                  height: "91px",
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

      <Button fullWidth type="submit" variant="secondary" sx={{ mt: 3 }} disabled={form.formState.isSubmitting}>
        Next
      </Button>
    </Box>
  );
};


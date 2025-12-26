import { useState, type JSX } from "react";
import {
  Box,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Stack,
  Chip,
  Grid,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SignupLayout from "../../layouts/SignupLayout";
import { StyledTextField } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schemas for each step
const step1Schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Must be a valid email format").required("Email is required"),
  phone: yup.string().required("Phone number is required").min(10, "Phone number must be at least 10 digits"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const step2Schema = yup.object().shape({
  plan: yup.string().required("Please select a plan"),
});

const step3Schema = yup.object().shape({
  paymentMethod: yup.string(),
  cardNumber: yup.string(),
  expiryDate: yup.string(),
  securityCode: yup.string(),
}).test("payment-method-or-card", "Please select a payment method or enter card details", function(value) {
  const { paymentMethod, cardNumber, expiryDate, securityCode } = value;
  // If payment method is set (apple, link, or card), it's valid
  if (paymentMethod) return true;
  // If all card details are provided, it's valid (we'll set paymentMethod to "card" in the handler)
  if (cardNumber && expiryDate && securityCode) return true;
  // Otherwise, invalid - attach error to paymentMethod field
  return this.createError({
    path: "paymentMethod",
    message: "Please select a payment method or enter card details",
  });
});

const step4Schema = yup.object().shape({
  businessName: yup.string().required("Business name is required"),
  businessDescription: yup.string().required("Business description is required"),
});

interface Step1FormInputs {
  username: string;
  email: string;
  phone: string;
  password: string;
}

interface Step2FormInputs {
  plan: string;
}

interface Step3FormInputs {
  paymentMethod: string;
  cardNumber?: string;
  expiryDate?: string;
  securityCode?: string;
}

interface Step4FormInputs {
  businessName: string;
  businessDescription: string;
  profileImage?: File;
  publicUrl?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
}

// Progress Indicator Component
const ProgressIndicator = ({ currentStep, totalSteps = 4 }: { currentStep: number; totalSteps?: number }) => {
  return (
    <Box sx={{ display: "flex", gap: 1, justifyContent: "center", width: 280 }}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <Box
          key={index}
          sx={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            backgroundColor: index + 1 <= currentStep ? "#D2E7FF" : "#E5E7EB",
          }}
        />
      ))}
    </Box>
  );
};

export default function SignUpPage(): JSX.Element {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");

  // Step 1 Form
  const step1Form = useForm<Step1FormInputs>({
    resolver: yupResolver(step1Schema) as any,
    defaultValues: { username: "", email: "", phone: "", password: "" },
  });

  // Step 2 Form
  const step2Form = useForm<Step2FormInputs>({
    resolver: yupResolver(step2Schema),
    defaultValues: { plan: "" },
  });

  // Step 3 Form
  const step3Form = useForm<Step3FormInputs>({
    resolver: yupResolver(step3Schema) as any,
    defaultValues: { paymentMethod: "", cardNumber: "", expiryDate: "", securityCode: "" },
  });

  // Step 4 Form
  const step4Form = useForm<Step4FormInputs>({
    resolver: yupResolver(step4Schema),
    defaultValues: { businessName: "", businessDescription: "", publicUrl: "", instagram: "", facebook: "", linkedin: "" },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStep1Submit = (data: any) => {
    console.log("Step 1 data:", data);
    setCurrentStep(2);
  };

  const handleStep2Submit = (data: Step2FormInputs) => {
    console.log("Step 2 data:", data);
    setCurrentStep(3);
  };

  const handleStep3Submit = (data: any) => {
    // If card details are provided but paymentMethod is not set, set it to "card"
    if (!data.paymentMethod && data.cardNumber && data.expiryDate && data.securityCode) {
      data.paymentMethod = "card";
    }
    console.log("Step 3 data:", data);
    setCurrentStep(4);
  };

  const handleStep4Submit = (data: Step4FormInputs) => {
    console.log("Step 4 data:", data);
    // Complete signup and navigate to dashboard
    navigate("/dashboard");
  };

  const renderStep1 = () => (
    <Box width="100%" maxWidth={400} component="form" onSubmit={step1Form.handleSubmit(handleStep1Submit)}>
      {/* Progress Indicator - Centered */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <ProgressIndicator currentStep={1} />
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
            src="/assets/icons/sigup_icon.svg"
            alt="email-icon"
            style={{ width: "36px", height: "36px" }}
          />
        </Box>
      </Box>
      
      <Typography variant="h5" textAlign="center" mb={3} sx={{ fontSize: "34px", color: "#1C1C1C", fontWeight: 600, textAlign: "center" }}>
        Let's help client book<br />you instantly.
      </Typography>

      <StyledTextField
        fullWidth
        variant="outlined"
        placeholder="ravwork.link/username"
        margin="normal"
        {...step1Form.register("username")}
        error={Boolean(step1Form.formState.errors.username)}
        helperText={step1Form.formState.errors.username?.message}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 0 }}>
                <Typography sx={{ color: "#6C737F" }}>@</Typography>
              </InputAdornment>
            ),
          },
        }}
      />

      <StyledTextField
        fullWidth
        variant="outlined"
        placeholder="Email"
        margin="normal"
        {...step1Form.register("email")}
        error={Boolean(step1Form.formState.errors.email)}
        helperText={step1Form.formState.errors.email?.message}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 0 }}>
                <img src="/assets/icons/sms.svg" alt="email-icon" style={{ width: "20px", height: "20px" }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <StyledTextField
        fullWidth
        variant="outlined"
        placeholder="Phone Number"
        margin="normal"
        {...step1Form.register("phone")}
        error={Boolean(step1Form.formState.errors.phone)}
        helperText={step1Form.formState.errors.phone?.message}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 0 }}>
                <img src="/assets/icons/sms.svg" alt="phone-icon" style={{ width: "20px", height: "20px" }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <StyledTextField
        fullWidth
        variant="outlined"
        type={showPassword ? "text" : "password"}
        placeholder="Create Password"
        margin="normal"
        {...step1Form.register("password")}
        error={Boolean(step1Form.formState.errors.password)}
        helperText={step1Form.formState.errors.password?.message}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 0 }}>
                <img src="/assets/icons/lock.svg" alt="lock-icon" style={{ width: "20px", height: "20px" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  <img
                    src={showPassword ? "/assets/icons/eye-slash.svg" : "/assets/icons/eye.svg"}
                    alt={showPassword ? "hide-password" : "show-password"}
                    style={{ width: "20px", height: "20px" }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Button fullWidth type="submit" variant="secondary" sx={{ mt: 2, mb: 2 }} disabled={step1Form.formState.isSubmitting}>
        Next
      </Button>

      <Box sx={{ mt: 2, width: "100%" }}>
        <Box sx={{ backgroundColor: "#F9FAFB", padding: "12px 16px", borderRadius: "8px", textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "#6C737F", fontSize: "11px", whiteSpace: "nowrap", display: "inline" }}>
            By clicking on Create Account I agree to the{" "}
            <Typography component="span" sx={{ fontWeight: 600, color: "#111927", fontSize: "11px" }}>
              Terms of Services & Privacy Policy
            </Typography>
          </Typography>
        </Box>
      </Box>

      <Typography variant="body2" textAlign="center" sx={{ fontSize: "16px", fontWeight: 400, color: "#1C1C1C" }}>
        Already Have an Account?{" "}
        <Typography
          component="span"
          sx={{ fontSize: "16px", fontWeight: 600, color: "#1C1C1C", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
          onClick={() => navigate("/login")}
        >
          Log In
        </Typography>
      </Typography>
    </Box>
  );

  const renderStep2 = () => (
    <Box width="100%" maxWidth={400} component="form" onSubmit={step2Form.handleSubmit(handleStep2Submit)}>
      {/* Back Icon - Before Progress Bar */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <IconButton
          onClick={handleBackClick}
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
        Select plan to activate your booking link.
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
        control={step2Form.control}
        render={({ field }) => (
          <FormControl fullWidth error={Boolean(step2Form.formState.errors.plan)}>
            <RadioGroup {...field} sx={{ gap: 2 }}>
              <FormControlLabel
                value="monthly"
                control={<Box sx={{ display: "none" }} />}
                onClick={() => field.onChange("monthly")}
                label={
                  <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                    <Typography fontWeight={600}>Monthly</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography fontWeight={600}>$15/ Month</Typography>
                      <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src="/assets/icons/check_icon_box.svg" alt="check-box" />
                        {field.value === "monthly" && (
                          <img src="/assets/icons/Check icon.svg" alt="check" style={{ width: "20.592px", height: "20.592px", position: "absolute" }} />
                        )}
                      </Box>
                    </Box>
                  </Box>
                }
                sx={{
                  border: "1px solid #D1D5DB",
                  borderRadius: 2,
                  p: 2,
                  width: "100%",
                  backgroundColor: field.value === "monthly" ? "#F9FAFB" : "transparent",
                  "&:hover": { backgroundColor: "#F9FAFB" },
                  cursor: "pointer",
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
                        top: -8,
                        right: 0,
                        backgroundColor: "#12B76A",
                        color: "white",
                        fontSize: "10px",
                        height: "20px",
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", mt: 1 }}>
                      <Typography fontWeight={600}>Yearly</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography fontWeight={600}>$12/ Month Billed Annually.</Typography>
                        <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <img src="/assets/icons/check_icon_box.svg" alt="check-box" />
                          {field.value === "yearly" && (
                            <img src="/assets/icons/Check icon.svg" alt="check" style={{ width: "20.592px", height: "20.592px", position: "absolute" }} />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                }
                sx={{
                  border: "1px solid #D1D5DB",
                  borderRadius: 2,
                  p: 2,
                  width: "100%",
                  backgroundColor: field.value === "yearly" ? "#E3F0F8" : "transparent",
                  "&:hover": { backgroundColor: "#F9FAFB" },
                  cursor: "pointer",
                }}
              />
            </RadioGroup>
            {step2Form.formState.errors.plan && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {step2Form.formState.errors.plan.message}
              </Typography>
            )}
          </FormControl>
        )}
      />

      <Button fullWidth type="submit" variant="secondary" sx={{ mt: 3 }} disabled={step2Form.formState.isSubmitting}>
        Next
      </Button>
    </Box>
  );

  const renderStep3 = () => (
    <Box width="100%" maxWidth={400} component="form" onSubmit={step3Form.handleSubmit(handleStep3Submit)}>
      {/* Back Icon - Before Progress Bar */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <IconButton
          onClick={handleBackClick}
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
            borderRadius: 2,
            py: 2,
            textTransform: "none",
            color: "#111927",
            "&:hover": { borderColor: "#9CA3AF", backgroundColor: "#F9FAFB" },
          }}
          onClick={() => step3Form.setValue("paymentMethod", "apple")}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography fontWeight={600}>Apple</Typography>
            <Typography fontWeight={600}>Pay</Typography>
          </Stack>
        </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            border: "1px solid #D1D5DB",
            borderRadius: 2,
            py: 2,
            textTransform: "none",
            color: "#111927",
            "&:hover": { borderColor: "#9CA3AF", backgroundColor: "#F9FAFB" },
          }}
          onClick={() => step3Form.setValue("paymentMethod", "link")}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 24, height: 24, backgroundColor: "#12B76A", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography sx={{ color: "white", fontSize: "12px", fontWeight: 600 }}>→</Typography>
            </Box>
            <Typography fontWeight={600}>link</Typography>
          </Stack>
        </Button>
      </Stack>

      {step3Form.formState.errors.root && (
        <Typography variant="caption" color="error" sx={{ mb: 1, display: "block" }}>
          {step3Form.formState.errors.root.message}
        </Typography>
      )}
      {step3Form.formState.errors.paymentMethod && (
        <Typography variant="caption" color="error" sx={{ mb: 1, display: "block" }}>
          {step3Form.formState.errors.paymentMethod.message}
        </Typography>
      )}

      <Typography variant="body2" sx={{ mb: 2, color: "#6C737F" }}>
        Or enter card details
      </Typography>

      <StyledTextField
        fullWidth
        variant="outlined"
        placeholder="Card Number"
        margin="normal"
        {...step3Form.register("cardNumber", {
          onChange: (e) => {
            if (e.target.value && !step3Form.getValues("paymentMethod")) {
              step3Form.setValue("paymentMethod", "card");
            }
          },
        })}
        error={Boolean(step3Form.formState.errors.cardNumber)}
        helperText={step3Form.formState.errors.cardNumber?.message}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Stack direction="row" spacing={0.5}>
                  <Typography variant="caption" sx={{ color: "#6C737F" }}>MC</Typography>
                  <Typography variant="caption" sx={{ color: "#6C737F" }}>VISA</Typography>
                  <Typography variant="caption" sx={{ color: "#6C737F" }}>AM EX</Typography>
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
            placeholder="Expiary Date"
            margin="normal"
            {...step3Form.register("expiryDate", {
              onChange: (e) => {
                if (e.target.value && !step3Form.getValues("paymentMethod")) {
                  step3Form.setValue("paymentMethod", "card");
                }
              },
            })}
            error={Boolean(step3Form.formState.errors.expiryDate)}
            helperText={step3Form.formState.errors.expiryDate?.message}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="Security Code"
            margin="normal"
            {...step3Form.register("securityCode", {
              onChange: (e) => {
                if (e.target.value && !step3Form.getValues("paymentMethod")) {
                  step3Form.setValue("paymentMethod", "card");
                }
              },
            })}
            error={Boolean(step3Form.formState.errors.securityCode)}
            helperText={step3Form.formState.errors.securityCode?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <img src="/assets/icons/lock.svg" alt="security" style={{ width: "16px", height: "16px" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
      </Grid>

      <Button fullWidth type="submit" variant="secondary" sx={{ mt: 3 }} disabled={step3Form.formState.isSubmitting}>
        Next
      </Button>
    </Box>
  );

  const renderStep4 = () => (
    <Box width="100%" maxWidth={400} component="form" onSubmit={step4Form.handleSubmit(handleStep4Submit)}>
      {/* Back Icon - Before Progress Bar */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <IconButton
          onClick={handleBackClick}
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
        <ProgressIndicator currentStep={4} />
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
            src="/assets/icons/profile_icon.svg"
            alt="icon"
            style={{ width: "36px", height: "36px" }}
          />
        </Box>
      </Box>
      
      {/* Title - Centered */}
      <Typography variant="h5" textAlign="center" mb={2} sx={{ fontSize: "34px", color: "#1C1C1C", fontWeight: 600, textAlign: "center" }}>
        Profile Set Up
      </Typography>

      {/* Profile Icon - Centered below title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: "#E3F0F8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PersonIcon sx={{ fontSize: 32, color: "#FFFFFF" }} />
        </Box>
      </Box>

      {/* Name or Business Name Field with Label */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "#111927" }}>
          Name or Business Name
        </Typography>
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Enter Name or Business Name"
          margin="normal"
          {...step4Form.register("businessName")}
          error={Boolean(step4Form.formState.errors.businessName)}
          helperText={step4Form.formState.errors.businessName?.message}
          sx={{ mt: 0 }}
        />
      </Box>

      {/* Business Description Field with Label */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "#111927" }}>
          Business Description
        </Typography>
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="About your Business"
          margin="normal"
          multiline
          rows={4}
          {...step4Form.register("businessDescription")}
          error={Boolean(step4Form.formState.errors.businessDescription)}
          helperText={step4Form.formState.errors.businessDescription?.message}
          sx={{ mt: 0 }}
        />
      </Box>

      {/* Photo Section - Two Column Layout: Label on left, Image on right */}
      <Grid container spacing={3} sx={{ mb: 3, alignItems: "flex-start" }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "#111927" }}>
            Photo
          </Typography>
          <Typography variant="caption" sx={{ color: "#6C737F", display: "block" }}>
            Image must be .png & .jpg format
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Box
                component="img"
                src={profileImagePreview || "/assets/images/tablecell.png"}
                alt="Profile"
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: 2,
                  objectFit: "cover",
                  border: "1px solid #D1D5DB",
                }}
              />
              <input
                accept="image/png,image/jpeg,image/jpg"
                style={{ display: "none" }}
                id="profile-image-upload"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="profile-image-upload">
                <Button
                  component="span"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    minWidth: "auto",
                    p: 1,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                  }}
                >
                  <img src="/assets/icons/send-2.svg" alt="upload" style={{ width: "20px", height: "20px", filter: "invert(1)" }} />
                </Button>
              </label>
            </Box>
            {profileImagePreview && (
              <Button
                variant="text"
                size="small"
                sx={{ 
                  mt: 1, 
                  color: "#F04438", 
                  textTransform: "none",
                  p: 0,
                  minWidth: "auto"
                }}
                onClick={() => {
                  setProfileImagePreview("");
                  setProfileImage(null);
                }}
              >
                Remove Profile Picture
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Your Public URL Section - Optional */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600, color: "#111927" }}>
          Your Public URL
        </Typography>
        <Typography variant="caption" sx={{ color: "#6C737F", display: "block", mb: 1 }}>
          Optional
        </Typography>
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Paste Url"
          margin="normal"
          {...step4Form.register("publicUrl")}
          sx={{ mt: 0 }}
        />
      </Box>

      {/* Social Media URLs */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Paste Url"
          margin="normal"
          {...step4Form.register("instagram")}
          sx={{ mt: 0 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0 }}>
                  <Box sx={{ width: 24, height: 24, backgroundColor: "#E4405F", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography sx={{ color: "white", fontSize: "10px" }}>IG</Typography>
                  </Box>
                </InputAdornment>
              ),
            },
          }}
        />
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Paste Url"
          margin="normal"
          {...step4Form.register("facebook")}
          sx={{ mt: 0 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0 }}>
                  <Box sx={{ width: 24, height: 24, backgroundColor: "#1877F2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography sx={{ color: "white", fontSize: "10px", fontWeight: 600 }}>f</Typography>
                  </Box>
                </InputAdornment>
              ),
            },
          }}
        />
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Paste Url"
          margin="normal"
          {...step4Form.register("linkedin")}
          sx={{ mt: 0 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0 }}>
                  <Box sx={{ width: 24, height: 24, backgroundColor: "#0A66C2", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography sx={{ color: "white", fontSize: "10px", fontWeight: 600 }}>in</Typography>
                  </Box>
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate("/dashboard")}
          sx={{ 
            borderColor: "#D1D5DB", 
            color: "#FFFFFF", 
            backgroundColor: "#E3F0F8",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#D1E7F0",
              borderColor: "#D1D5DB",
            }
          }}
        >
          Skip
        </Button>
        <Button 
          fullWidth 
          type="submit" 
          variant="secondary" 
          disabled={step4Form.formState.isSubmitting}
          sx={{ textTransform: "none" }}
        >
          Next
        </Button>
      </Stack>
    </Box>
  );

  const handleBackClick = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <SignupLayout>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </Box>
    </SignupLayout>
  );
}

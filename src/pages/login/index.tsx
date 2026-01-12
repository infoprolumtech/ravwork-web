import { type JSX } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import SignupLayout from "../../layouts/SignupLayout";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../utils/yup-config";
import { useLoginMutation } from "../../rtk/endpoints/authApi";
import { showAlert } from "../../rtk/feature/alertSlice";
import { useAppDispatch } from "../../rtk/store";
import { loginUser } from "../../rtk/feature/authSlice";
import PageIcon from "../../components/shared/PageIcon";
import FormFieldWithIcon from "../../components/shared/FormFieldWithIcon";
import PasswordField from "../../components/shared/PasswordField";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
    mode: "onChange", // Validate on change (while typing)
  });

  const watchedFields = watch();
  const isFormValid = watchedFields.email && watchedFields.password;

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap();
      
      // Handle successful login response
      if (response?.data?.tokens?.accessToken) {
        const userData = {
          ...response.data.user,
          accessToken: response.data.tokens.accessToken,
          refreshToken: response.data.tokens.refreshToken,
          profileStep: response.data.user?.profileStep,
        };
        dispatch(loginUser(userData));
        dispatch(showAlert({ message: "Login successful", severity: "success" }));
        
        // Check if signup flow is incomplete (profileStep < 3 means not all steps done)
        // profileStep 3 = signup complete
        const profileStep = response.data.user?.profileStep || 0;
        if (profileStep < 3) {
          // Redirect to signup with the next step to complete
          // profileStep 1 = Step 1 done, show Step 2
          // profileStep 2 = Step 2 done, show Step 3
          navigate("/signup", { state: { resumeStep: profileStep + 1 } });
        } else {
          // Signup complete (profileStep >= 3), go to dashboard
          navigate("/dashboard");
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
    }
  };


  return (
    <SignupLayout showBackIcon={false} onBackClick={() => navigate(-1)}>
      <Box
        width="100%"
        maxWidth={{ xs: "100%", sm: "400px" }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          mx: "auto",
        }}
      >
        {/* Icon above title */}
        <PageIcon
          iconSrc="/assets/icons/sigup_icon.svg"
          iconAlt="signup-icon"
        />

        <Typography 
          variant="h5" 
          textAlign="center" 
          mb={{ xs: 2, sm: 3 }} 
          fontWeight={600}
          sx={{ fontSize: { xs: "24px", sm: "28px", md: "34px" } }}
        >
          Sign In
        </Typography>
        <FormFieldWithIcon
          fullWidth
          variant="outlined"
          type="text"
          placeholder="Email"
          margin="normal"
          iconSrc="/assets/icons/mail.svg"
          iconAlt="email-icon"
          {...register("email", {
            onChange: () => trigger("email"),
          })}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          sx={{ mb: 1.5 }}
        />

        <PasswordField
          fullWidth
          variant="outlined"
          placeholder="Enter Password"
          margin="normal"
          lockIconSrc="/assets/icons/lock_signup.svg"
          {...register("password", {
            onChange: () => trigger("password"),
          })}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          sx={{ mb: 1 }}
        />

        <Typography
          variant="subtitle2"
          textAlign="right"
          mt={1}
          mb={{ xs: 2, sm: 2.5 }}
          sx={{
            width: "100%",
            cursor: "pointer",
            color: "#1C1C1C",
            fontSize: { xs: "14px", sm: "16px" },
            "&:hover": {
              textDecoration: "underline",
            }
          }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </Typography>

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
            disabled={isSubmitting || !isFormValid}
            sx={{
              height: { xs: "44px", sm: "48px" },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Sign In"
            )}
          </Button>
          <Typography 
            variant="body2" 
            textAlign="center" 
            sx={{ 
              mt: { xs: 1.5, sm: 2 },
              fontSize: { xs: "14px", sm: "16px" },
              display: "block",
            }}
          >
            Don't Have an Account?{" "}
            <Typography
              component="span"
              sx={{ 
                fontWeight: 600, 
                fontSize: { xs: "14px", sm: "16px" },
                color: "#111927", 
                cursor: "pointer", 
                "&:hover": { textDecoration: "underline" } 
              }}
              onClick={() => navigate("/")}
            >
              Sign Up
            </Typography>
          </Typography>
        </Box>
      </Box>
    </SignupLayout>
  );
}

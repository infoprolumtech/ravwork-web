import { type JSX } from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../utils/yup-config";
import { useLoginMutation } from "../../rtk/endpoints/authApi";
import { showAlert } from "../../rtk/feature/alertSlice";
import { useAppDispatch } from "../../rtk/store";
import { loginUser } from "../../rtk/feature/authSlice";
import FormFieldWithIcon from "../../components/shared/FormFieldWithIcon";
import PasswordField from "../../components/shared/PasswordField";
import AuthPageWrapper from "../../components/shared/AuthPageWrapper";
import { calculateProfileComplete, extractErrorMessage } from "../../utils/helper";
import serviceApi from "../../rtk/endpoints/serviceApi";
import userApi from "../../rtk/endpoints/userApi";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();
      const accessToken = result.tokens?.accessToken || result.accessToken || result.user?.accessToken;
      const refreshToken = result.tokens?.refreshToken || result.refreshToken || result.user?.refreshToken;

      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('init', import.meta.env.VITE_APP_META_PIXEL_ID, {
          em: data.email.toLowerCase(),
          ...(result.user?.phoneNumber ? { ph: result.user.phoneNumber.replace(/\D/g, '') } : {})
        });
      }

      const userData = {
        ...result.user,
        accessToken,
        refreshToken,
      };
      dispatch(loginUser(userData));
      dispatch(showAlert({ message: "Login successful", severity: "success" }));

      let hasServices = false;
      try {
        const servicesResult = await dispatch(
          serviceApi.endpoints.getServices.initiate({ page: 1, limit: 1 }, { forceRefetch: true })
        ).unwrap();
        hasServices = Array.isArray(servicesResult)
          ? servicesResult.length > 0
          : Array.isArray((servicesResult as any)?.data)
            ? (servicesResult as any).data.length > 0
            : (servicesResult as any)?.items
              ? (servicesResult as any).items.length > 0
              : false;
      } catch {
      }

      let profileData = result.user;
      try {
        const profileResult = await dispatch(
          userApi.endpoints.getUserProfile.initiate(undefined, { forceRefetch: true })
        ).unwrap();
        if (profileResult) {
          profileData = { ...profileData, ...profileResult };
        }
      } catch {
      }

      const completion = calculateProfileComplete(
        {
          displayName: profileData?.displayName ?? "",
          profilePhoto: profileData?.profilePhoto ?? "",
          businessDescription: profileData?.businessDescription ?? "",
        },
        hasServices
      );

      if (completion === 100) {
        navigate("/dashboard");
        return;
      }

      const profileStep = result.user?.profileStep || 0;
      if (profileStep < 3) {
        navigate("/signup", { state: { resumeStep: profileStep + 1 } });
      } else if (completion >= 50) {
        navigate("/services-offered");
      } else {
        navigate("/my-profile");
      }
    } catch (error: unknown) {
      dispatch(showAlert({
        message: extractErrorMessage(error, "Invalid email or password. Please try again."),
        severity: "error"
      }));
    }
  };

  const footer = (
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
        onClick={() => navigate("/signup")}
      >
        Sign Up
      </Typography>
    </Typography>
  );

  return (
    <AuthPageWrapper
      title="Sign In"
      iconSrc="/assets/icons/sigup_icon.svg"
      buttonText="Sign In"
      isButtonDisabled={!isValid}
      isButtonLoading={isSubmitting || isLoggingIn}
      onSubmit={handleSubmit(onSubmit)}
      footer={footer}
    >
      <FormFieldWithIcon
        fullWidth
        variant="outlined"
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
          color: "#111927",
          fontSize: { xs: "14px", sm: "16px" },
          "&:hover": {
            textDecoration: "underline",
          }
        }}
        onClick={() => navigate("/forgot-password")}
      >
        Forgot Password?
      </Typography>
    </AuthPageWrapper>
  );
}


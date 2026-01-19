import { useEffect, useState, type JSX } from "react";
import { Stack, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPassSchema } from "../../utils/yup-config";
import { useAppDispatch } from "../../rtk/store";
import { showAlert } from "../../rtk/feature/alertSlice";
import { useForgotPasswordMutation } from "../../rtk/endpoints/authApi";
import FormFieldWithIcon from "../../components/shared/FormFieldWithIcon";
import GlobalDialog from "../../components/dialog";
import AuthPageWrapper from "../../components/shared/AuthPageWrapper";
import { extractErrorMessage } from "../../utils/helper";

type FormData = {
  email: string;
};

export default function ForgotPassword(): JSX.Element {
  const [forgotPassword, { isSuccess, isLoading: isResending }] = useForgotPasswordMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showCheckMailPopup, setShowCheckMailPopup] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(forgotPassSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      setUserEmail(data.email);
      dispatch(showAlert({
        message: "Password reset link has been sent to your email.",
        severity: "success",
      }));
    } catch (error: unknown) {
      dispatch(showAlert({
        message: extractErrorMessage(error, "Failed to send reset link. Please try again."),
        severity: "error",
      }));
    }
  };

  const handleResendLink = async () => {
    try {
      if (userEmail) {
        await forgotPassword({ email: userEmail }).unwrap();
        dispatch(showAlert({ message: "Link resent successfully.", severity: "success" }));
      }
    } catch (error: unknown) {
      dispatch(showAlert({
        message: extractErrorMessage(error, "Failed to resend link."),
        severity: "error",
      }));
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setShowCheckMailPopup(true);
    }
  }, [isSuccess]);

  return (
    <>
      <AuthPageWrapper
        title="Forgot Password"
        iconSrc="/assets/icons/forgot_icon.svg"
        description="Enter your registered email address we'll send you a link to reset your password"
        buttonText="Send Verification Link"
        isButtonDisabled={!isValid}
        isButtonLoading={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
        showBackIcon={true}
        onBackClick={() => navigate("/login")}
      >
        <FormFieldWithIcon
          fullWidth
          placeholder="Email"
          margin="normal"
          iconSrc="/assets/icons/mail.svg"
          iconAlt="email-icon"
          {...register("email", {
            onChange: () => trigger("email"),
          })}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          sx={{ mb: 2 }}
        />
      </AuthPageWrapper>

      <GlobalDialog
        open={showCheckMailPopup}
        handleClose={() => setShowCheckMailPopup(false)}
        component={
          <Stack spacing={2} sx={{ p: 4, alignItems: "center", textAlign: "center" }}>
            <img src="/assets/icons/mail.svg" alt="Email" style={{ width: 60, height: 60 }} />
            <Typography variant="h5" fontWeight={600}>Please check your mail</Typography>
            <Typography variant="body2" color="#6C737F">
              A reset password link has been sent to{" "}
              <Typography component="span" fontWeight={600} color="#111927">{userEmail}</Typography>
            </Typography>
            <Stack spacing={2} width="100%" sx={{ mt: 2 }}>
              <Button fullWidth variant="secondary" onClick={handleResendLink} disabled={isResending} sx={{ borderRadius: "50px", textTransform: "none" }}>
                {isResending ? "Resending..." : "Resend Link"}
              </Button>
              <Button fullWidth variant="outlined" onClick={() => navigate("/login")} sx={{ borderRadius: "50px", textTransform: "none" }}>
                Back to Login
              </Button>
            </Stack>
          </Stack>
        }
      />
    </>
  );
}

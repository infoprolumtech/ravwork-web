import { useEffect, useState, type JSX } from "react";
import { Box, Stack, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
        hideWarningLine={true}
        component={
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              flex: 1,
              width: "100%",
              height: "100%",
              minHeight: 0,
            }}
          >
            <IconButton
              onClick={() => setShowCheckMailPopup(false)}
              aria-label="close"
              sx={{ position: "absolute", top: { xs: 6, sm: 8 }, right: { xs: 6, sm: 8 } }}
            >
              <CloseIcon />
            </IconButton>

            <Stack
              spacing={1.5}
              sx={{
                p: { xs: 2.5, sm: 4 },
                alignItems: "flex-start",
                textAlign: "left",
                flex: 1,
                minHeight: 0,
              }}
            >
              <Typography variant="h5" fontWeight={600} sx={{ fontSize: { xs: "18px", sm: "24px" } }}>
                Please check your mail
              </Typography>
              <Typography variant="body2" color="#6C737F" sx={{ fontSize: { xs: "16px", sm: "16px" } }}>
                A reset password link has been sent to{" "}
                <Box component="span" sx={{ fontWeight: 500, color: "#111927" }}>
                  {userEmail}
                </Box>
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                width="100%"
                sx={{
                  mt: "auto",
                  pt: { xs: 2, sm: 3 },
                  justifyContent: { xs: "stretch", sm: "flex-end" },
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate("/login")}
                  sx={{
                    borderRadius: "50px",
                    textTransform: "none",
                    color: "#111927",
                    borderColor: "#E5E7EB",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleResendLink}
                  disabled={isResending}
                  sx={{ borderRadius: "50px", textTransform: "none", width: { xs: "100%", sm: "auto" } }}
                >
                  {isResending ? "Resending..." : "Resend Verification Link"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        }
      />
    </>
  );
}

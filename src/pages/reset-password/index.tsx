import { useEffect, useState, type JSX } from "react";
import { Box, Stack, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPassSchema } from "../../utils/yup-config";
import { useResetPasswordMutation } from "../../rtk/endpoints/authApi";
import { useAppDispatch } from "../../rtk/store";
import { showAlert } from "../../rtk/feature/alertSlice";
import PasswordField from "../../components/shared/PasswordField";
import GlobalDialog from "../../components/dialog";
import AuthPageWrapper from "../../components/shared/AuthPageWrapper";
import { extractErrorMessage } from "../../utils/helper";

interface ResetPasswordFormInputs {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const token = searchParams.get("token")?.trim();

  const [showCongratulationPopup, setShowCongratulationPopup] = useState(false);
  const [resetPassword, { isSuccess }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting, isValid, touchedFields },
  } = useForm<ResetPasswordFormInputs>({
    resolver: yupResolver(resetPassSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    if (!token) {
      dispatch(showAlert({
        message: "Invalid or missing reset token. Please request a new password reset link.",
        severity: "error",
      }));
      navigate("/forgot-password");
      return;
    }

    try {
      await resetPassword({
        token: token,
        newPassword: data.password,
      }).unwrap();
    } catch (error: unknown) {
      dispatch(showAlert({
        message: extractErrorMessage(error, "Failed to reset password. Please try again."),
        severity: "error",
      }));
    }
  };

  useEffect(() => {
    if (!token) {
      dispatch(showAlert({
        message: "Invalid or missing reset token. Please request a new password reset link.",
        severity: "error",
      }));
      navigate("/forgot-password");
    }
  }, [token, navigate, dispatch]);

  useEffect(() => {
    if (isSuccess) {
      setShowCongratulationPopup(true);
    }
  }, [isSuccess]);

  const handleCloseCongratulationPopup = () => {
    setShowCongratulationPopup(false);
    navigate("/login");
  };

  return (
    <>
      <AuthPageWrapper
        title="Change Password"
        iconSrc="/assets/icons/forgot_icon.svg"
        description="Phone number verification is only for job updates. You will not receive messages for anything else."
        buttonText="Change Password"
        isButtonDisabled={!isValid}
        isButtonLoading={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
      >
        <PasswordField
          fullWidth
          placeholder="Enter new password"
          margin="normal"
          lockIconSrc="/assets/icons/lock_signup.svg"
          {...register("password", {
            onChange: () => {
              trigger("password");
              trigger("confirmPassword");
            },
          })}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
        />

        <PasswordField
          fullWidth
          placeholder="Confirm new password"
          margin="normal"
          lockIconSrc="/assets/icons/lock_signup.svg"
          {...register("confirmPassword", {
            onChange: () => trigger("confirmPassword"),
            onBlur: () => trigger("confirmPassword"),
          })}
          error={Boolean(errors.confirmPassword && touchedFields.confirmPassword)}
          helperText={errors.confirmPassword && touchedFields.confirmPassword ? errors.confirmPassword.message : ""}
          sx={{ mb: 2 }}
        />
      </AuthPageWrapper>

      {/* Congratulation Popup */}
      <GlobalDialog
        open={showCongratulationPopup}
        handleClose={handleCloseCongratulationPopup}
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
              onClick={handleCloseCongratulationPopup}
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
                Congratulation!!
              </Typography>
              <Typography variant="body2" color="#6C737F" sx={{ mb: { xs: 2, sm: 3 }, fontSize: { xs: "13px", sm: "14px" } }}>
                Your Password has been Successfully changed
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
                  onClick={handleCloseCongratulationPopup}
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
                  onClick={() => navigate("/login")}
                  sx={{ borderRadius: "50px", textTransform: "none", width: { xs: "100%", sm: "auto" } }}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        }
      />
    </>
  );
}

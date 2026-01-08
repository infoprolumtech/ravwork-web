import { useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import SignupLayout from '../../layouts/SignupLayout';
import { yupResolver } from '@hookform/resolvers/yup';
import { changePassSchema } from '../../utils/yup-config';
import { useAppDispatch } from '../../rtk/store';
import { showAlert } from '../../rtk/feature/alertSlice';
import { useNavigate } from 'react-router-dom';
import { useChangePasswordMutation, useLogoutMutation } from '../../rtk/endpoints/authApi';
import { logoutUser } from '../../rtk/feature/authSlice';
import PasswordField from '../../components/shared/PasswordField';
import Icon from '../../components/shared/Icon';

interface ChangePasswordFormInputs {
    newPassword: string;
    confirmPassword: string;
}

export default function ChangePasswordPage() {
    const [changePassword, {isSuccess}] = useChangePasswordMutation();
    const [logout] = useLogoutMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<ChangePasswordFormInputs>({
        resolver:(yupResolver(changePassSchema))
    });

    const watchedFields = watch();
    const isFormValid = watchedFields.newPassword && watchedFields.confirmPassword && 
                       !errors.newPassword && !errors.confirmPassword;

    const onSubmit = async (data: ChangePasswordFormInputs) => {
      try {
        await changePassword({
          oldPassword: "", // Not required in this flow
          newPassword: data.newPassword,
        });
      } catch (error) {
        console.error('Error changing password:', error);
      }
    };

    useEffect(() => {
      if (isSuccess) {
        dispatch(showAlert({ message: "Password changed successfully. Please log in again with your new password.", severity: "success" }));
        logout(undefined).unwrap().then(() => {
          dispatch(logoutUser());
          navigate("/login");
        }).catch(() => {
          // Even if logout fails, still log out user locally
          dispatch(logoutUser());
          navigate("/login");
        });
      }
    }, [isSuccess, dispatch, logout, navigate]);
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
            position: "relative",
            mx: "auto",
          }}
        >
          {/* Icon above title */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: { xs: 2, sm: 3 },
              mt: { xs: 0, sm: 2 },
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
              <Icon
                src="/assets/icons/forgot_icon.svg"
                alt="forgot-password-icon"
                sx={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </Box>
          </Box>

          <Typography
            variant="h5"
            fontWeight={600}
            textAlign="center"
            mb={{ xs: 2, sm: 3 }}
            sx={{ fontSize: { xs: "24px", sm: "28px", md: "34px" } }}
          >
            Change Password
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            mb={{ xs: 2, sm: 3 }}
            sx={{ 
              color: "#6C737F",
              fontSize: { xs: "14px", sm: "16px" },
              px: { xs: 1, sm: 0 },
            }}
          >
            Phone number verification is only for job updates. You will not
            receive messages for anything else. krishna
          </Typography>

          {/* New Password Field */}
          <PasswordField
            fullWidth
            placeholder="Enter new password"
            margin="normal"
            {...register("newPassword")}
            error={Boolean(errors.newPassword)}
            helperText={errors.newPassword?.message}
            sx={{ mb: 1.5 }}
          />

          {/* Confirm Password Field */}
          <PasswordField
            fullWidth
            placeholder="Confirm new password"
            margin="normal"
            {...register("confirmPassword")}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword?.message}
            sx={{ mb: 1.5 }}
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
              type="submit"
              fullWidth
              variant="secondary"
              disabled={isSubmitting || !isFormValid}
              sx={{
                height: { xs: "44px", sm: "48px" },
              }}
            >
              {isSubmitting ? "Changing Password..." : "Change Password"}
            </Button>
          </Box>
        </Box>
      </SignupLayout>
    );
}

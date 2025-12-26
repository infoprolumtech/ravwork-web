import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    Grid
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { StyledTextField } from '../../utils/helper';
import AdminLayout from '../../layouts/AdminLayout';
import { yupResolver } from '@hookform/resolvers/yup';
import { changePassSchema } from '../../utils/yup-config';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../rtk/feature/alertSlice';
import { useNavigate } from 'react-router-dom';
import { useChangePasswordMutation, useLogoutMutation } from '../../rtk/endpoints/authApi';
import { logoutUser } from '../../rtk/feature/authSlice';
import { colors } from '../../utils/constants';

interface ChangePasswordFormInputs {
    newPassword: string;
    confirmPassword: string;
}

export default function ChangePasswordPage() {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [changePassword, {isSuccess}] = useChangePasswordMutation();
    const [logout] = useLogoutMutation();
    const dispatch = useDispatch();
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
        logout({}).then(() => {
          dispatch(logoutUser());
          navigate("/login");
        });
      }
    }, [isSuccess]);
    return (
      <AdminLayout>
        <Grid container justifyContent="center" alignItems="center">
          <Box
            width="100%"
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            px={4}
            py={8}
            sx={{ maxWidth: { xs: "100%", lg: "500px" } }}
          >
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
                  src="/assets/icons/forgot_icon.svg"
                  alt="forgot-password-icon"
                  style={{ width: "36px", height: "36px" }}
                />
              </Box>
            </Box>

            <Typography
              variant="h5"
              fontWeight="bold"
              textAlign="center"
              mb={4}
            >
              Change Password
            </Typography>

            {/* New Password Field */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: colors["Gray-600"],
                  mb: 0.5,
                  fontSize: "14px",
                }}
              >
                -New Password-
              </Typography>
            <StyledTextField
              fullWidth
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter New Password"
              margin="normal"
              {...register("newPassword")}
              error={Boolean(errors.newPassword)}
              helperText={errors.newPassword?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 0 }}>
                      <img
                        src="/assets/icons/lock.svg"
                        alt="lock-icon"
                        loading="lazy"
                          style={{ width: "20px", height: "20px" }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword((prev) => !prev)}
                      >
                        <img
                          src={showNewPassword ? "/assets/icons/eye-slash.svg" : "/assets/icons/eye.svg"}
                          alt={showNewPassword ? "hide-password" : "show-password"}
                          style={{ width: "20px", height: "20px" }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
              <Typography
                variant="body2"
                sx={{
                  color: colors["Gray-600"],
                  fontSize: "12px",
                  mt: 0.5,
                  ml: 1,
                }}
              >
                Your password should contain at least 1 uppercase, 1 lowercase, 1 special character, and 1 digit.
              </Typography>
            </Box>

            {/* Confirm Password Field */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: colors["Gray-600"],
                  mb: 0.5,
                  fontSize: "14px",
                }}
              >
                -Confirm Password-
              </Typography>
            <StyledTextField
              fullWidth
              type={showConfirmPassword ? "text" : "password"}
                placeholder="Enter Confirm Password"
              margin="normal"
              {...register("confirmPassword")}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 0 }}>
                      <img
                        src="/assets/icons/lock.svg"
                        alt="lock-icon"
                        loading="lazy"
                          style={{ width: "20px", height: "20px" }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        <img
                          src={showConfirmPassword ? "/assets/icons/eye-slash.svg" : "/assets/icons/eye.svg"}
                          alt={showConfirmPassword ? "hide-password" : "show-password"}
                          style={{ width: "20px", height: "20px" }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="secondary"
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? "Changing Password..." : "Change Password"}
            </Button>
          </Box>
        </Grid>
      </AdminLayout>
    );
}

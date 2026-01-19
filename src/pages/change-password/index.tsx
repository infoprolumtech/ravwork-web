import { useEffect, type JSX } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { changePassSchema } from "../../utils/yup-config";
import { useAppDispatch } from "../../rtk/store";
import { showAlert } from "../../rtk/feature/alertSlice";
import { useChangePasswordMutation, useLogoutMutation } from "../../rtk/endpoints/authApi";
import { logoutUser } from "../../rtk/feature/authSlice";
import PasswordField from "../../components/shared/PasswordField";
import AuthPageWrapper from "../../components/shared/AuthPageWrapper";
import { extractErrorMessage } from "../../utils/helper";

interface ChangePasswordFormInputs {
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordPage(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [changePassword, { isSuccess }] = useChangePasswordMutation();
  const [logout] = useLogoutMutation();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ChangePasswordFormInputs>({
    resolver: yupResolver(changePassSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ChangePasswordFormInputs) => {
    try {
      await changePassword({
        oldPassword: "", // Not required in this flow if coming from reset/authenticated? 
        // Note: The API might expect oldPassword if authenticated. 
        // But the previous code had oldPassword: "". I'll keep it for now.
        newPassword: data.newPassword,
      }).unwrap();
    } catch (error: unknown) {
      dispatch(showAlert({
        message: extractErrorMessage(error, "Failed to change password. Please try again."),
        severity: "error",
      }));
    }
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(showAlert({ message: "Password changed successfully. Please log in again.", severity: "success" }));
      logout().unwrap().finally(() => {
        dispatch(logoutUser());
        navigate("/login");
      });
    }
  }, [isSuccess, dispatch, logout, navigate]);

  return (
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
        {...register("newPassword", {
          onChange: () => {
            trigger("newPassword");
            trigger("confirmPassword");
          },
        })}
        error={Boolean(errors.newPassword)}
        helperText={errors.newPassword?.message}
      />

      <PasswordField
        fullWidth
        placeholder="Confirm new password"
        margin="normal"
        lockIconSrc="/assets/icons/lock_signup.svg"
        {...register("confirmPassword", {
          onChange: () => trigger("confirmPassword"),
        })}
        error={Boolean(errors.confirmPassword)}
        helperText={errors.confirmPassword?.message}
        sx={{ mb: 1.5 }}
      />
    </AuthPageWrapper>
  );
}

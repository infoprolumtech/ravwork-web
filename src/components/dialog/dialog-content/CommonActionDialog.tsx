import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack, Typography, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { reasonSchema } from "../../../utils/yup-config";
import { StyledTextField } from "../../../utils/helper";

interface UserActionDialogProps {
  title: string;
  subtitle: string;
  reason: string;
  handleCancel: () => void;
  onSubmit: (reason: {}) => void;
}

interface ReasonInput {
  reason: string;
}


export default function CommonActionDialog({
  title,
  subtitle, 
  reason,
  handleCancel,
  onSubmit,
}: UserActionDialogProps) {
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReasonInput>({
    resolver: yupResolver(reasonSchema),
  });

  const submitHandler = (data: ReasonInput) => {
    onSubmit(data);
  };

  return (
    <Stack gap={2}>
      <Stack gap={1}>
        <img
          src="/assets/icons/alert.svg"
          alt="alert-icon"
          style={{
            width: "56px",
            height: "56px",
          }}
        />
          <Typography variant="h5" fontWeight={600} fontSize={"28px"}>
            {title}
          </Typography>
      </Stack>

        <Typography variant="subtitle1" fontSize={"22px"}>
          {subtitle}
        </Typography>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Typography
          variant="h6"
          fontSize={"14px"}
          color={theme.palette.primary[900]}
        >
          {reason}
        </Typography>
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Type here"
          margin="normal"
          {...register("reason")}
          error={Boolean(errors.reason)}
          helperText={errors.reason?.message}
          sx={{
            mt:0,
          }}
        />
        <Stack flexDirection={"row"} justifyContent={"flex-end"} gap={2}>
          <Button variant="primary" onClick={handleCancel}>
            No, cancel
          </Button>
          <Button variant="secondary" type="submit" disabled={isSubmitting}>
            Confirm
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}

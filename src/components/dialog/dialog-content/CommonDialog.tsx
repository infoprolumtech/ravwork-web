import { Button, Stack, Typography, CircularProgress } from "@mui/material";
import Icon from "../../shared/Icon";

interface CommonDialogProps {
  handleCancel: () => void;
  handleConfirm: (data: unknown) => void;
  title: string;
  subTitle: string;
  confirmText?: string;
  cancelText?: string;
  confirmDisabled?: boolean;
}

export default function CommonDialog({
  handleCancel,
  handleConfirm,
  title,
  subTitle,
  confirmText = "Confirm",
  cancelText = "No, cancel",
  confirmDisabled = false,
}: CommonDialogProps) {
  const submitHandler = () => {
    handleConfirm({});
  };

  return (
    <Stack gap={2}>
      <Stack gap={1}>
        <Icon
          src="/assets/icons/alert.svg"
          alt="alert-icon"
          size={56}
        />
        <Typography variant="h5" fontSize="28px" fontWeight={600}>
          {title}
        </Typography>
      </Stack>
      <Typography variant="subtitle1" fontSize="22px">
        {subTitle}
      </Typography>
      <Stack flexDirection="row" justifyContent="flex-end" gap={2}>
        <Button variant="primary" onClick={handleCancel} disabled={confirmDisabled}>
          {cancelText}
        </Button>
        <Button variant="secondary" onClick={submitHandler} disabled={confirmDisabled}>
          {confirmDisabled ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            confirmText
          )}
        </Button>
      </Stack>
    </Stack>
  );
}

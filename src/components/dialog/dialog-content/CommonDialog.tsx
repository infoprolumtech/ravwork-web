import { Button, Stack, Typography, } from "@mui/material";



interface CommonDialogProps {
  handleCancel: () => void;
  handleConfirm: (data:any) => void;
  title: string;
  subTitle: string;
}
export default function CommonDialog({
  handleCancel,
  handleConfirm,
  title,
  subTitle
}: CommonDialogProps) {
  const submitHandler = (data: any) => {
    handleConfirm(data);
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
          <Typography variant="h5" fontSize={"28px"} fontWeight={600}>
            {title}
          </Typography>
      </Stack>
        <Typography variant="subtitle1" fontSize={"22px"}>
          {subTitle}
        </Typography>
      <Stack flexDirection={"row"} justifyContent={"flex-end"} gap={2}>
        <Button variant="primary" onClick={handleCancel}>
          No, cancel
        </Button>
        <Button variant="secondary" onClick={submitHandler}>
          Confirm
        </Button>
      </Stack>
    </Stack>
  );
}

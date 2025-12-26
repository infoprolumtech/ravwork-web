import { Stack, Typography } from "@mui/material";

interface DetailStackProps {
    title: string;
    value: string;
    icon?: React.ReactNode;
    onClick?: () => void;
  }
  
  export const DetailStack = ({
    title,
    value,
    icon,
    onClick = () => {},
  }: DetailStackProps) => {
    return (
      <Stack gap={1} minWidth={270}>
        <Typography variant="title">{title}</Typography>
        <Stack direction="row" alignItems="center" gap={1} onClick={onClick} sx={{cursor: (onClick !== undefined) ? "pointer" : "default"}}>
          <Typography variant="caption">{value}</Typography>
          {icon && icon}
        </Stack>
      </Stack>
    );
  };
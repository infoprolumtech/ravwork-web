import { type JSX } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { StyledTextField } from "../../../utils/helper";

interface CompleteJobModalProps {
  onClose: () => void;
  onSubmit: (data: { finalPrice?: number; priceNotes?: string }) => Promise<void>;
  isSubmitting?: boolean;
}

interface CompleteJobFormData {
  finalPrice?: string;
  priceNotes?: string;
}

const completeJobSchema = yup.object().shape({
  finalPrice: yup
    .string()
    .required("Price is required")
    .test("is-valid-number", "Please enter a valid price (must be a positive number)", (value) => {
      if (!value || value.trim() === "") return false; // Required field
      const num = parseFloat(value);
      return !isNaN(num) && num >= 0;
    }),
  priceNotes: yup.string().optional(),
});

export default function CompleteJobModal({
  onClose,
  onSubmit,
  isSubmitting = false,
}: CompleteJobModalProps): JSX.Element {
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<CompleteJobFormData>({
    resolver: yupResolver(completeJobSchema) as any,
    mode: "onChange",
    defaultValues: {
      finalPrice: "",
      priceNotes: "",
    },
  });

  const finalPriceValue = watch("finalPrice");

  const submitHandler = handleSubmit(async (data: CompleteJobFormData) => {
    const finalPrice = data.finalPrice?.trim()
      ? parseFloat(data.finalPrice.trim())
      : undefined;
    const priceNotes = data.priceNotes?.trim() || undefined;

    await onSubmit({ finalPrice, priceNotes });
  });

  return (
    <Stack
      sx={{
        padding: { xs: "20px", sm: "32px", md: "40px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: { xs: "16px", sm: "20px", md: "24px" },
        width: "100%",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Header - Title and Close icon in same row */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: "100%" }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "20px", sm: "24px", md: "28px" },
            fontWeight: 600,
            color: "#111927",
            flex: 1,
            marginTop: "20px",
          }}
        >
          How Much Was Charged for this service?
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            p: 0.5,
            "&:hover": { backgroundColor: "transparent" },
          }}
        >
          <Close sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>

      {/* Form */}
      <form onSubmit={submitHandler} style={{ width: "100%" }}>
        <Stack spacing={3} sx={{ width: "100%" }}>
          {/* Price Input */}
          <Controller
            name="finalPrice"
            control={control}
            render={({ field }) => (
              <Box>
               
                <StyledTextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter added price here"
                  type="number"
                  inputProps={{ min: 0, step: "0.01" }}
                  error={Boolean(errors.finalPrice)}
                  helperText={errors.finalPrice?.message}
                  disabled={isSubmitting}
                  required
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("finalPrice");
                  }}
                  onBlur={() => {
                    field.onBlur();
                    trigger("finalPrice");
                  }}
                />
              </Box>
            )}
          />

          
        </Stack>
      </form>

      {/* Action Buttons */}
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={{ xs: 1.5, sm: 2 }}
        sx={{
          width: "100%",
          flexWrap: { xs: "wrap", sm: "nowrap" },
        }}
      >
        {/* <Button
          variant="primary"
          onClick={onClose}
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#FFFFFF",
            color: "#111927",
            fontSize: { xs: "14px", sm: "16px" },
            px: { xs: 2, sm: 3 },
            "&:hover": {
              backgroundColor: "#F3F4F6",
            },
          }}
        >
          My Orders
        </Button> */}
        <Button
          variant="secondary"
          type="submit"
          onClick={submitHandler}
          disabled={isSubmitting || Boolean(errors.finalPrice) || !finalPriceValue || finalPriceValue.trim() === ""}
          sx={{
            cursor: isSubmitting || Boolean(errors.finalPrice) || !finalPriceValue || finalPriceValue.trim() === "" ? "not-allowed" : "pointer",
            fontSize: { xs: "14px", sm: "16px" },
            px: { xs: 2, sm: 3 },
            opacity: isSubmitting || Boolean(errors.finalPrice) || !finalPriceValue || finalPriceValue.trim() === "" ? 0.6 : 1,
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Submit Earnings"
          )}
        </Button>
      </Stack>
    </Stack>
  );
}


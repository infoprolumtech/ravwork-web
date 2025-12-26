import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";
import DropdownArrow from "/assets/icons/dropdown-arrow-black.svg";

const DropdownArrowIcon = () => <img src={DropdownArrow} alt="open select menu" style={{marginRight:8}}/>;
interface Option {
  label: string;
  value: string;
}

interface SelectFieldProps {
  field: any;
  error: any;
  options: Option[];
  disabled?: boolean;
}
export default function StyledSelector({
  field,
  error,
  options,
  disabled=false,
}: SelectFieldProps) {
  const theme = useTheme();
  return (
    <>
      <FormControl error={!!error} fullWidth>
        <Select
          {...field}
          disabled={disabled}
          displayEmpty
          IconComponent={DropdownArrowIcon}
          error={!!error}
          fullWidth
          variant="outlined"
          MenuProps={{
            disablePortal: false,
            PaperProps: {
              style: {
                maxHeight: 250,
                overflowY: "auto",
              },
            }, // required for z-index to take effect
            sx: {
              zIndex: 3000, // custom z-index
            },
          }}
          sx={{
            borderRadius: "12px",
            padding: 0,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary[50], // or any color you want
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary[50], // hover color
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary[50], // focused color
            },
            "& .MuiSelect-select": {
              fontSize: "14px",
              fontWeight: 400,
              color: "#031C5F",
              padding: "10px 14px", // padding for the select input
            },
          }}
        >
          <MenuItem
            value={""}
            sx={{ fontSize: "14px", fontWeight: 400, color: "#031C5F" }}
          >
            Select
          </MenuItem>
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{ fontSize: "14px", fontWeight: 400, color: "#031C5F" }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {error && (
          <FormHelperText
            sx={{
              fontSize: "12px",
              color: "#7A271A !important",
            }}
          >
            {error.message}
          </FormHelperText>
        )}
      </FormControl>
    </>
  );
}

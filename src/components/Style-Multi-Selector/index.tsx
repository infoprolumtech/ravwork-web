import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { ListItemIcon } from "@mui/material";
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
}

export default function StyledMultiSelector({
  field,
  error,
  options,
}: SelectFieldProps) {
  const theme = useTheme();

  const selectedValues: string[] = field.value || [];
  const handleDelete = (value: string) => {
    const newValues = selectedValues.filter((val) => val !== value);
    field.onChange(newValues);
  };
  return (
    <>
      <FormControl error={!!error} fullWidth>
        <Select
          {...field}
          IconComponent={DropdownArrowIcon}
          multiple
          displayEmpty
          error={!!error}
          fullWidth
          variant="outlined"
          value={selectedValues}
          onChange={(e) => field.onChange(e.target.value)}
          renderValue={(selected) =>
            selectedValues.length === 0
              ? "Select"
              : (selected as string[]).join(", ")
          }
          MenuProps={{
            disablePortal: false,
            sx: {
              zIndex: 3000,
            },
          }}
          sx={{
            borderRadius: "12px",
            padding: 0,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary[600],
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.A100,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.A100,
            },
            "& .MuiSelect-select": {
              fontSize: "14px",
              fontWeight: 400,
              color: "#031C5F",
              padding: "10px 14px",
            },
          }}
        >
          <MenuItem value="">Select</MenuItem>
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{ fontSize: "14px", fontWeight: 400, color: "#031C5F" }}
              >
                {isSelected && (
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <CheckIcon fontSize="small" sx={{color:theme.palette.primary.dark}} />
                  </ListItemIcon>
                )}
                {option.label}
              </MenuItem>
            );
})}
        </Select>

        {/* Show error message */}
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

        {/* Show selected chips below the select field */}
        {selectedValues.length > 0 && (
          <Box mt={1} display="flex" gap={1} flexWrap="wrap">
            {selectedValues.map((val) => {
              const selectedOption = options.find((opt) => opt.value === val);
              return (
                <Chip
                  key={val}
                  label={selectedOption?.label || val}
                  onDelete={() => handleDelete(val)}
                  sx={{
                    fontSize: "12px",
                    color: theme.palette.primary.light,
                    backgroundColor: theme.palette.primary.dark,
                    "& .MuiChip-deleteIcon": {
                      color: theme.palette.primary.light,
                    },
                    "& .MuiChip-deleteIcon:hover": {
                      color: theme.palette.primary.light,
                    },
                  }}
                />
              );
            })}
          </Box>
        )}
      </FormControl>
    </>
  );
}

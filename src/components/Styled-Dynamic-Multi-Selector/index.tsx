import React from "react";
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";
import GlobalSearch from "../global-search/GlobalSearch";
import CheckIcon from "@mui/icons-material/Check";
import DropdownArrow from "/assets/icons/dropdown-arrow-black.svg";

const DropdownArrowIcon = () => <img src={DropdownArrow} alt="open select menu" style={{marginRight:8}}/>;

interface Option {
  label: string;
  value: string;
}

interface StyledMultiSelectorProps {
  field?: any; // for form libraries
  value?: string[]; // for controlled usage (array for multi-select)
  onChange?: (value: string[]) => void; // for controlled usage
  error?: any;
  options: Option[];
  onLoadMore?: () => void; // infinite scroll callback
  hasMore?: boolean; // if more options are available
  loading?: boolean; // loading state for options
  setSearchQuery: (q: string) => void;
  onDeleteChip?: (value: string) => void; // callback for chip deletion
  searchPlaceholder?: string;
}

export default function StyledDynamicMultiSelector({
  field,
  value,
  onChange,
  error,
  options,
  onLoadMore,
  hasMore,
  loading,
  setSearchQuery,
  onDeleteChip,
  searchPlaceholder = "Search Tag",
}: StyledMultiSelectorProps) {
  // Handler for infinite scroll
  const handleMenuScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const list = event.currentTarget;
    if (
      onLoadMore &&
      hasMore &&
      !loading &&
      list.scrollTop + list.clientHeight >= list.scrollHeight - 5
    ) {
      onLoadMore();
    }
  };

  // Value and onChange logic for multi-select
  const selectValue = field ? field.value : value || [];
  const handleChange = (e: any) => {
    const newValue = e.target.value;
    if (field && field.onChange) field.onChange(e);
    if (onChange) onChange(newValue);
  };

  // Handler for chip deletion
  const handleChipDelete = (chipValue: string) => {
    // Remove the value from the current selection
    const newValue = selectValue.filter((value: string) => value !== chipValue);
    
    // Update form field if using react-hook-form
    if (field && field.onChange) {
      field.onChange(newValue);
    }
    
    // Update controlled value if not using form
    if (onChange) {
      onChange(newValue);
    }
    
    // Call optional callback
    if (onDeleteChip) {
      onDeleteChip(chipValue);
    }
  };

  return (
    <div>
      <FormControl error={!!error} fullWidth>
        <Select
          {...(field || {})}
          multiple
          value={selectValue}
        IconComponent={DropdownArrowIcon}

          onChange={handleChange}
          displayEmpty
          error={!!error}
          fullWidth
          variant="outlined"
          MenuProps={{
            disablePortal: false,
            sx: { zIndex: 3000 },
            PaperProps: {
              style: {
                maxHeight: 250,
                overflowY: "auto",
              },
              onScroll: handleMenuScroll,
            },
          }}
          sx={{
            borderRadius:"12px",
            height: "44px",
            px: 1,
            fontSize: 14,
            color: "#031C5F",
            ".MuiOutlinedInput-notchedOutline": {
              border: "1px solid #9ED5F9",
            },
          }}
          renderValue={(selected) => {
            if (!Array.isArray(selected) || selected.length === 0)
              return <span style={{ color: "#031C5F" }}>Select</span>;
            return `${selected.length} selected`;
          }}
        >
          {/* Search bar inside dropdown as a custom div */}
          <GlobalSearch setSearchQuery={setSearchQuery} isIconFront={false} placeholder={searchPlaceholder}/>
          {/* Options */}
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{ 
                fontSize: "14px", 
                fontWeight: 400, 
                color: "#031C5F",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: selectValue.includes(option.value) ? "#E3F2FD" : "transparent",
                "&:hover": {
                  backgroundColor: selectValue.includes(option.value) ? "#BBDEFB" : "#F5F5F5"
                },
                "&.Mui-selected": {
                  backgroundColor: "#E3F2FD",
                  "&:hover": {
                    backgroundColor: "#BBDEFB"
                  }
                }
              }}
            >
              {option.label}
              {selectValue.includes(option.value) && (
          <CheckIcon sx={{ color: "#1976d2", fontSize: "20px" }} />
        )}
            </MenuItem>
          ))}
           {options.length === 0 && (
          <Stack
            sx={{
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              minHeight: "120px",
            }}
          >
            No options found
          </Stack>
        )}
          {/* Infinite scroll loader */}
          {loading && (
            <MenuItem disabled sx={{ justifyContent: "center" }}>
              <CircularProgress size={20} />
            </MenuItem>
          )}
        </Select>
        {error && (
          <FormHelperText sx={{ fontSize: "12px", color: "#7A271A !important" }}>
            {error.message}
          </FormHelperText>
        )}
      </FormControl>
      
      {/* Chips displayed below the select */}
      <Stack direction="row" gap={1} flexWrap="wrap" mt={1}>
        {options
          .filter((o) => selectValue.includes(o.value))
          .map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              size="small"
              sx={{
                backgroundColor: "#0D1530",
                borderRadius: "6px",
                color: "#F5F5F5",
                fontSize: "14px",
                fontWeight: 400,
                "& .MuiChip-deleteIcon":{
                  color: "#F5F5F5",
                },
                "& .MuiChip-deleteIcon:hover":{
                  color: "#F5F5F5",
                }
              }}
              onDelete={() => handleChipDelete(option.value)}
            />
          ))}
      </Stack>
    </div>
  );
}

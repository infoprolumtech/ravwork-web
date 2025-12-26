import React from "react";
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  CircularProgress,
  Stack,
} from "@mui/material";
import GlobalSearch from "../global-search/GlobalSearch";
import DropdownArrow from "/assets/icons/dropdown-arrow-black.svg";
import CheckIcon from "@mui/icons-material/Check";

const DropdownArrowIcon = () => <img src={DropdownArrow} alt="open select menu" style={{marginRight:8}}/>;

interface Option {
  label: string;
  value: string;
}

interface StyledSelectorProps {
  title?: string;
  field?: any; // for form libraries
  value?: string; // for controlled usage
  onChange?: (value: string) => void; // for controlled usage
  error?: any;
  options: Option[];
  onLoadMore?: () => void; // infinite scroll callback
  hasMore?: boolean; // if more options are available
  loading?: boolean; // loading state for options
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchPlaceholder?: string;
}

export default function StyledDynamicSelector({
  field,
  value,
  title = "Select",
  onChange,
  error,
  options,
  onLoadMore,
  hasMore,
  loading,
  setSearchQuery,
  searchPlaceholder = "Search Category",
}: StyledSelectorProps) {
  // Handler for infinite scroll
  const handleMenuScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const list = event.currentTarget;

    const scrollThreshold =
      list.scrollTop + list.clientHeight >= list.scrollHeight - 5;

    if (onLoadMore && hasMore && !loading && scrollThreshold) {
      onLoadMore();
    }
  };

  // Value and onChange logic
  const selectValue = field ? field.value : value;
  const handleChange = (e: any) => {
    if (field && field.onChange) field.onChange(e);
    if (onChange) onChange(e.target.value);
  };

  return (
    <FormControl error={!!error} sx={{ width: field ? "100%" : "fit-content" }}>
      <Select
        {...(field || {})}
        fullWidth
        value={selectValue}
        IconComponent={DropdownArrowIcon}
        onChange={handleChange}
        displayEmpty
        error={!!error}
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
        sx={
          field
            ? {
                borderRadius: "12px",
                height: "44px",
                px: 1,
                fontSize: 14,
                color: "#031C5F",
                ".MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #9ED5F9",
                },
              }
            : {
                width: field ? "100%" : "auto",
                backgroundColor: "#F3FAFE",
                fontWeight: 500,
                fontSize: 14,
                color: "#031C5F",
                height: "44px",
                px: 2,
                borderRadius: "100px",
                ".MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  paddingRight: "14px !important",
                },
                "& .MuiPaper-root-MuiPopover-paper-MuiMenu-paper": {},
              }
        }
        renderValue={(selected) => {
          if (!selected)
            return <span style={{ color: "#031C5F" }}>{title}</span>;
          const selectedOption = options.find((o) => o.value === selected);
          return selectedOption ? selectedOption.label : "";
        }}
      >
        {/* Search bar inside dropdown as a custom div */}
        <div style={{ padding: 8, borderBottom: "1px solid #eee" }}>
          <GlobalSearch
            setSearchQuery={setSearchQuery}
            isIconFront={false}
            placeholder={searchPlaceholder}
          />
        </div>
        {/* Option: Placeholder */}
        {/* <MenuItem
          value=""
          sx={{ fontSize: "14px", fontWeight: 400, color: "#031C5F" }}
        >
          All
        </MenuItem> */}
        {/* Options */}
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{ fontSize: "14px", fontWeight: 400, color: "#031C5F",
              display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
             }}
          >
            {option.label}
            {selectValue === option.value && (
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
  );
}

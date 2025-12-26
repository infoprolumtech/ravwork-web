import { MenuItem, Select } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import DropdownArrow from "/assets/icons/dropdown-arrow-black.svg";

const DropdownArrowIcon = () => <img src={DropdownArrow} alt="dropdown" />;

interface filter {
  title: string;
  value: string;
}

interface SelectFilterProps {
  title: string;
  filterList: filter[];
  setFilter: (value: string) => void;
  setPage: (value: any) => void;
  defaultFilter?: string;
}
export default function SelectFilter({
  filterList,
  setFilter,
  setPage,
  title = "Status:All",
  defaultFilter = "All",
}: SelectFilterProps) {
  const [selectedValue, setSelectedValue] = useState("all");

  const handleChange = (event: any) => {
    const value = event.target.value;
    setSelectedValue(value);
    setFilter(value);
    setPage(0);
  };

  return (
    <Select
      value={selectedValue}
      onChange={handleChange}
      displayEmpty
      variant="outlined"
      IconComponent={DropdownArrowIcon} 
      MenuProps={{
        disablePortal: false,
        sx: { zIndex: 3000 },
        PaperProps: {
          style: {
            maxHeight: 250,
            minWidth: "300px",
            overflowY: "auto",
            borderRadius: "8px",
          }
        },
      }}
      sx={{
        backgroundColor: "#F3FAFE",
        fontWeight: 500,
        fontSize: 16,
        color: "#031C5F",
        width: "fit-content",
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
      }}
      renderValue={(selected) => {
        if (!selected || selected === "all")
          return <span style={{ color: "#031C5F" }}>{title}</span>;
        const selectedOption = filterList.find((o) => o.value === selected);
        return selectedOption ? selectedOption.title : "";
      }}
    >
      <MenuItem
        value="all"
        sx={{ 
          fontSize: "16px", 
          fontWeight: 400, 
          color: "#111927",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        {defaultFilter}
        {selectedValue === "all" && (
          <CheckIcon sx={{ color: "#1976d2", fontSize: "20px" }} />
        )}
      </MenuItem>
      {filterList.map((filter: any, index: number) => (
        <MenuItem
          key={index}
          value={filter.value}
          sx={{ 
            fontSize: "16px", 
            fontWeight: 400, 
            color: "#111927",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {filter.title}
          {selectedValue === filter.value && (
            <CheckIcon sx={{ color: "#1976d2", fontSize: "20px" }} />
          )}
        </MenuItem>
      ))}
    </Select>
  );
}

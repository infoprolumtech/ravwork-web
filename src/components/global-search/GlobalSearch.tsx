import { Box, InputBase } from "@mui/material";

interface GlobalSearchProps {
  setSearchQuery: (value: string) => void;
  isIconFront?: boolean;
  placeholder?: string;
}
export default function GlobalSearch({
  setSearchQuery,
  isIconFront = true,
  placeholder = "Search",
}: GlobalSearchProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: "22px",
        width: "auto",
        height: "44px",
        fontSize: "14px",
        px: 2,
      }}
    >
      {isIconFront && (
        <img
          src={"/assets/icons/search.svg"}
          alt="search"
          width={24}
          height={24}
          style={{ marginRight: "8px", marginLeft: "16px" }}
        />
      )}
      <InputBase
        placeholder={placeholder}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          flex: 1,
          height: "100%",
          fontSize: "16px",
          color: "black",
        }}
      />
      {!isIconFront && (
        <img
          src={"/assets/icons/search.svg"}
          alt="search"
          width={24}
          height={24}
          style={{ marginRight: "8px", marginLeft: "16px" }}
        />
      )}
    </Box>
  );
}

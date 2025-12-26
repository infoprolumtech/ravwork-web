import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  useTheme,
  Box,
  Typography,
  Pagination,
  PaginationItem,
  Stack,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { colors } from "../../utils/constants";
import type { Column } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import { encryptAES, ROWS_LIMIT } from "../../utils/helper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface TableProps<T extends { [key: string]: any }> {
  columns: readonly Column<T>[];
  rows: readonly T[];
  url?: string;
  onRowClick?: (row: T) => void;
  filters?: Record<keyof T, string | string[]>;
  page?: number;
  selected?: string[];
  setSelected?: (value: string[]) => void;
  setPage?: any;
  count?: number;
  rowKey?: string; // ✅ Added to track selected row by id
  onSelectionChange?: (ids: any[]) => void;
  enableCheckbox?: boolean;
  order?: string;
  setOrder?: (value: any) => void;
}

export default function GlobalTable<T extends { [key: string]: any }>({
  columns,
  rows,
  url,
  rowKey = "id",
  selected = [],
  setSelected = () => {},
  page = -1,
  setPage,
  count = 10,
  onSelectionChange,
  enableCheckbox = false,
  order = "asc",
  setOrder = () => {},
  ...rest
}: TableProps<T>) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [filters, setFilters] = React.useState<Record<keyof T, string>>(
    {} as any
  );

  const isSelected = (id: any) => selected.includes(id);

  const handleClick = (_: React.MouseEvent<unknown>, id: any) => {
    const encryptedId = encryptAES(id);
    const selectedIndex = selected.indexOf(encryptedId);
    let newSelected: any[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, encryptedId];
    } else if (selectedIndex === 0) {
      newSelected = selected.slice(1);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = selected.slice(0, -1);
    } else {
      newSelected = [
        ...selected.slice(0, selectedIndex),
        ...selected.slice(selectedIndex + 1),
      ];
    }

    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newSelected: any[] = [];
    if (event.target.checked) {
      newSelected = rows.map((row) => encryptAES(row[rowKey]));
    }
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  // State for per-column filter menu
  const [filterAnchorEls, setFilterAnchorEls] = React.useState<
    Record<string, HTMLElement | null>
  >({});

  const handleSort = () => {
    // if (orderBy !== columnId) {
    //   setOrderBy(columnId);
    //   setOrder("asc");
    // } else {
    //   setOrder(order === "asc" ? "desc" : "asc");
    // }
    setOrder(order === "asc" ? "desc" : order === "desc" ? "" : "asc");
  };

  const handleFilterButtonClick = (
    columnId: string,
    event: React.MouseEvent<HTMLElement>
  ) => {
    setFilterAnchorEls((prev) => ({
      ...prev,
      [columnId]: event.currentTarget,
    }));
  };

  const handleFilterClose = (columnId: string) => {
    setFilterAnchorEls((prev) => ({
      ...prev,
      [columnId]: null,
    }));
  };

  const handleFilterSelect = (columnId: keyof T, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
    setPage(0);
    handleFilterClose(columnId as string);
  };

  const handleChangePage = (_: unknown, newPage: number) =>
    setPage(newPage - 1);

  const LeftArrowIcon = () => {
    return (
      <Stack
        flexDirection="row"
        alignItems="center"
        gap={1}
        sx={{
          cursor: page > 0 ? "pointer" : "not-allowed",
          opacity: page > 0 ? 1 : 0.5,
          "&:hover": {
            opacity: page > 0 ? 0.7 : 0.5,
          },
        }}
        onClick={() => {
          if (page > 0) {
            handleChangePage(null, page);
          }
        }}
      >
        <ArrowBackIcon />
        <Typography
          sx={{
            display: { xs: "none", sm: "block" },
            fontFamily: "Oxanium, sans-serif",
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          Previous
        </Typography>
      </Stack>
    );
  };

  const RightArrowIcon = () => {
    return (
      <Stack
        flexDirection="row"
        alignItems="center"
        gap={1}
        sx={{
          cursor:
            page + 1 < Math.ceil(count / ROWS_LIMIT)
              ? "pointer"
              : "not-allowed",
          opacity: page + 1 < Math.ceil(count / ROWS_LIMIT) ? 1 : 0.5,
          "&:hover": {
            opacity: page + 1 < Math.ceil(count / ROWS_LIMIT) ? 0.7 : 0.5,
          },
        }}
        onClick={() => {
          if (page + 1 < Math.ceil(count / ROWS_LIMIT)) {
            handleChangePage(null, page + 2);
          }
        }}
      >
        <Typography
          sx={{
            display: { xs: "none", sm: "block" },
            fontFamily: "Oxanium, sans-serif",
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          Next
        </Typography>
        <ArrowForwardIcon />
      </Stack>
    );
  };
  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: "24px",
        boxShadow: "none",
      }}
    >
      <TableContainer
        sx={{
          maxHeight: "800px",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {enableCheckbox && (
                <TableCell
                  padding="checkbox"
                  style={{
                    backgroundColor: colors["Gray-50"],
                  }}
                >
                  <Checkbox
                    icon={<img src={"/assets/icons/_Checkbox base.svg"} alt="check" width={20} height={20} />}
                    checkedIcon={<img src={"/assets/icons/Checkbox.svg"} alt="check" width={20} height={20} />}
                    sx={{
                      color: theme.palette.primary[900],
                      "&.Mui-checked": {
                        color: theme.palette.primary[800], // dark tick color
                      },
                      "&.MuiCheckbox-indeterminate": {
                        color: theme.palette.primary[800], // ✅ indeterminate state color
                      },
                    }}
                    indeterminate={
                      selected.length > 0 && selected.length < rows.length
                    }
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id as string}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    fontSize: "12px",
                    fontWeight: "500",
                    color: colors["Gray-500"],
                    backgroundColor: colors["Gray-50"],
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={order !== ""}
                      direction={order === "asc" ? "asc" : "desc"}
                      onClick={() => handleSort()}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                  {column.filterOptions && (
                    <>
                      <IconButton
                        onClick={(e) =>
                          handleFilterButtonClick(column.id as string, e)
                        }
                      >
                        <FilterListIcon fontSize="small" />
                      </IconButton>
                      <Menu
                        anchorEl={filterAnchorEls[column.id as string]}
                        open={Boolean(filterAnchorEls[column.id as string])}
                        onClose={() => handleFilterClose(column.id as string)}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                      >
                        <MenuItem
                          key="All"
                          selected={
                            !filters[column.id] || filters[column.id] === "All"
                          }
                          onClick={() => handleFilterSelect(column.id, "All")}
                        >
                          All
                        </MenuItem>
                        {column.filterOptions.map((option: any) => (
                          <MenuItem
                            key={option}
                            selected={filters[column.id] === option}
                            onClick={() =>
                              handleFilterSelect(column.id, option)
                            }
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </Menu>
                    </>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row) => {
              const id = row[rowKey];
              const selectedRow = isSelected(encryptAES(id));
              return (
                <TableRow
                  key={id}
                  hover
                  onClick={() => {
                    rest.onRowClick?.(row);
                    if (url) {
                      navigate(`${url}?id=${encryptAES(id)}`);
                    }
                  }}
                  selected={selectedRow}
                  sx={{
                    backgroundColor: colors["Base-White"],
                    cursor: "pointer",
                  }}
                >
                  {enableCheckbox && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        icon={<img src={"/assets/icons/_Checkbox base.svg"} alt="check" width={20} height={20} />}
                        checkedIcon={<img src={"/assets/icons/Checkbox.svg"} alt="check" width={20} height={20} />}
                        sx={{
                          color: theme.palette.primary[900],
                          "&.Mui-checked": {
                            color: theme.palette.primary[800], // dark tick color
                          },
                        }}
                        checked={selectedRow}
                        onClick={(event) => {
                          event.stopPropagation(); // avoid triggering row click
                          handleClick(event, id);
                        }}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.id as string}
                      align={column.align}
                      sx={
                        column.id === rowKey
                          ? {
                              fontSize: "14px",
                              fontWeight: 500,
                              color: colors["Gray-900"],
                            }
                          : {
                              fontSize: "14px",
                              fontWeight: 400,
                              color: colors["Gray-1000"],
                            }
                      }
                    >
                      {row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {page !== -1 && rows.length > 0 && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{marginTop:"30px !important"}}
        >
          <LeftArrowIcon />
          <Pagination
            sx={{
              py: 2,
              "& .MuiPagination-ul": {
                justifyContent: "center",
              },
              "& .MuiPagination-ul:first-child": {
                alignSelf: "flex-start",
              },
              "& .MuiPaginationItem-root": {
                fontFamily: "Oxanium, sans-serif",
                fontSize: "16px",
                fontWeight: 500,
              },
              "& .MuiPaginationItem-page": {
                fontFamily: "Oxanium, sans-serif",
                fontSize: "16px",
                fontWeight: 500,
              },
              "& .MuiPaginationItem-ellipsis": {
                fontFamily: "Oxanium, sans-serif",
                fontSize: "16px",
                fontWeight: 500,
              },
            }}
            shape="rounded"
            boundaryCount={1}
            siblingCount={0}
            color="primary"
            page={page + 1}
            onChange={handleChangePage}
            count={Math.ceil(count / ROWS_LIMIT)}
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: LeftArrowIcon, next: RightArrowIcon }}
                {...item}
                sx={{
                  "&.MuiPaginationItem-previousNext": {
                    pointerEvents: "none",
                    cursor: "default",
                    display: "none",
                  },
                }}
              />
            )}
          />
          <RightArrowIcon />
        </Stack>
      )}
      {rows.length === 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 3,
            color: "black",
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            No data available
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { JSX } from "react";

export default function TableSkeleton(): JSX.Element {
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableCell key={index}>
                    <Skeleton variant="rectangular" width={210} height={30} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            <TableRow>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableCell key={index}>
                  <Skeleton variant="rectangular" width={210} height={30} />
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
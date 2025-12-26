import { Button, Stack } from "@mui/material";

interface RenderActionsProps {
    status:string;
    handleOpenDialog: (...args: any[]) => void;
}

export const RenderActions = ({status, handleOpenDialog}: RenderActionsProps) => {
    if (status === "active") {
      return (
        <Stack
          direction="row"
          spacing={1}
          minWidth={270}
          alignItems="center"
          justifyContent="flex-end"
        >
          <Button
            variant="danger2"
            onClick={() => handleOpenDialog("delete")}
          >
            Delete
          </Button>
          <Button
            variant="primarySquare"
            onClick={() => handleOpenDialog("block")}
          >
            Block
          </Button>
        </Stack>
      );
    }

    if (status === "delete") {
      return (
        <Stack direction="column" alignItems="flex-end" minWidth={270}>
          <Button
            variant="primarySquare"
            onClick={() => handleOpenDialog("reactive")}
          >
            Re-Activate
          </Button>
        </Stack>
      );
    }

    if (status === "block") {
      return (
        <Stack direction="row" spacing={1} minWidth={270}>
          <Button
            variant="danger2"
            onClick={() => handleOpenDialog("delete")}
          >
            Delete
          </Button>
          <Button
            variant="primarySquare"
            onClick={() => handleOpenDialog("reactive")}
          >
            Re-Activate
          </Button>
        </Stack>
      );
    }

    return null;
  };
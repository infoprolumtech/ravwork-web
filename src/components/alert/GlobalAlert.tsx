

import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { closeAlert } from "../../rtk/feature/alertSlice";
import type { AppDispatch, RootState } from "../../rtk/store";


// Define AlertState interface (adjust according to your actual alertSlice)
interface AlertState {
  open: boolean;
  message: string | string[];
  severity: "error" | "info" | "success" | "warning";
}

const GlobalAlert: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const alert = useSelector((state: RootState) => state.alert as AlertState);
  const [show, setShow] = useState<boolean>(alert?.open);

  useEffect(() => {
    setShow(alert?.open);
  }, [alert?.open]);

  const handleClose = () => {
    setShow(false);
    dispatch(closeAlert());
  };

  const formattedMessage = useMemo(() => {
    if (Array.isArray(alert?.message)) {
      return alert.message.filter(Boolean).map((item, index) => (
        <React.Fragment key={index}>
          {item}
          <br />
        </React.Fragment>
      ));
    }
    return alert?.message;
  }, [alert?.message]);

  return (
    <Snackbar
      ClickAwayListenerProps={{
        onClickAway: () => null,
      }}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={show}
      onClose={handleClose}
      autoHideDuration={4000}
      sx={{ zIndex: 9999 }}
    >
      <MuiAlert
        onClose={handleClose}
        severity={alert?.severity}
        sx={{ zIndex: 9999 }}
      >
        {formattedMessage}
      </MuiAlert>
    </Snackbar>
  );
};

export default GlobalAlert;

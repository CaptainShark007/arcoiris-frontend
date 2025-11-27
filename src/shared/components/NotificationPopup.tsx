import { Snackbar, Alert, AlertColor } from "@mui/material";

interface NotificationPopupProps {
  open: boolean;
  message: string;
  severity?: AlertColor; // 'error' | 'warning' | 'info' | 'success'
  onClose: () => void;
  autoHideDuration?: number;
  position?:
    | { vertical: "top" | "bottom"; horizontal: "left" | "center" | "right" };
}

export const NotificationPopup = ({
  open,
  message,
  severity = "info",
  onClose,
  autoHideDuration = 3000,
  position = { vertical: "top", horizontal: "center" },
}: NotificationPopupProps) => {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={autoHideDuration}
      anchorOrigin={position}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "100%",
          borderRadius: 2,
          fontSize: "0.9rem",
          fontWeight: 500,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

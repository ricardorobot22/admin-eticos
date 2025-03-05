import React from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningAmberIcon from "@mui/icons-material/WarningAmber"; // Importa el ícono de alerta
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const CustomAlertDialog = ({ open, onClose, onContinue, message, type }) => {
  // Determina el ícono y color en función del tipo de alerta
  let icon;
  let title;

  if (type === "success") {
    icon = <CheckCircleIcon fontSize="large" color="success" />;
    title = "Éxito";
  } else if (type === "error") {
    icon = <ErrorIcon fontSize="large" color="error" />;
    title = "Error";
  } else if (type === "alert") {
    icon = <WarningAmberIcon fontSize="large" color="warning" />; // Usa el ícono de alerta
    title = "Alerta";
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          {icon}
          <Typography variant="h6">{title}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>
      <DialogActions>
        {type === "alert" && (
          <Button onClick={onContinue} color="primary">
            Eliminar
          </Button>
        )}

{
  type === "alert" ? (
    <Button onClick={onClose} color="primary">
      Cancelar
    </Button>
  ) : (
    <Button onClick={onContinue} color="primary">
      Cerrar
    </Button>
  )
}
  
      </DialogActions>
    </Dialog>
  );
};

CustomAlertDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onContinue: PropTypes.func,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "alert"]).isRequired,
};

export default CustomAlertDialog;

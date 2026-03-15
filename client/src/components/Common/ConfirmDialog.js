import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'warning',
  onConfirm,
  onCancel,
}) => {
  const colors = {
    warning: {
      bg: '#FEF3C7',
      color: '#D97706',
      icon: <WarningIcon sx={{ color: '#D97706', mr: 1 }} />
    },
    error: {
      bg: '#FEE2E2',
      color: '#DC2626',
      icon: <WarningIcon sx={{ color: '#DC2626', mr: 1 }} />
    },
    info: {
      bg: '#DBEAFE',
      color: '#2563EB',
      icon: <WarningIcon sx={{ color: '#2563EB', mr: 1 }} />
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: 400,
        }
      }}
    >
      <DialogTitle id="confirm-dialog-title" sx={{ 
        display: 'flex', 
        alignItems: 'center',
        bgcolor: colors[severity].bg,
        color: colors[severity].color,
        fontWeight: 600
      }}>
        {colors[severity].icon}
        {title || 'Confirm Action'}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <DialogContentText id="confirm-dialog-description">
          {message || 'Are you sure you want to perform this action?'}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onCancel} variant="outlined" color="inherit">
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={severity === 'warning' ? 'error' : 'primary'}
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
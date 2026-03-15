import React from 'react';
import {
  Alert as MuiAlert,
  AlertTitle,
  Collapse,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Alert = ({
  severity = 'info',
  title,
  message,
  open = true,
  onClose,
  action,
  ...props
}) => {
  return (
    <Collapse in={open}>
      <MuiAlert
        severity={severity}
        action={
          <>
            {action}
            {onClose && (
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={onClose}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            )}
          </>
        }
        sx={{ mb: 2 }}
        {...props}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </MuiAlert>
    </Collapse>
  );
};

export default Alert;
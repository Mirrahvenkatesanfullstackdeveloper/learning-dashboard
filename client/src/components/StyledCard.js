import React from 'react';
import { Card, CardContent, styled } from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'light'
    ? 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
    : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  borderRadius: 16,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'linear-gradient(90deg, #1976d2, #9c27b0)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    background: theme.palette.mode === 'light'
      ? 'radial-gradient(circle at top right, rgba(25,118,210,0.1), transparent)'
      : 'radial-gradient(circle at top right, rgba(156,39,176,0.2), transparent)',
    borderRadius: '0 0 0 100%',
  },
}));

const GradientCard = ({ children, ...props }) => {
  return (
    <StyledCard {...props}>
      <CardContent>
        {children}
      </CardContent>
    </StyledCard>
  );
};

export default GradientCard;
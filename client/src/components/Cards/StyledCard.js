import React from 'react';
import { Card, CardContent, CardMedia, CardActions, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { backgrounds } from '../../assets/images/backgrounds';

const StyledCardRoot = styled(Card)(({ theme, gradient, pattern }) => ({
  position: 'relative',
  overflow: 'hidden',
  background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: pattern || backgrounds.pattern2,
    backgroundBlendMode: 'overlay',
    opacity: 0.1,
    pointerEvents: 'none',
  },
}));

const StyledCard = ({
  children,
  gradient,
  pattern,
  media,
  mediaHeight = 140,
  actions,
  ...props
}) => {
  return (
    <StyledCardRoot gradient={gradient} pattern={pattern} {...props}>
      {media && (
        <CardMedia
          component="img"
          height={mediaHeight}
          image={media}
          alt="Card media"
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </CardContent>
      {actions && (
        <CardActions sx={{ position: 'relative', zIndex: 1 }}>
          {actions}
        </CardActions>
      )}
    </StyledCardRoot>
  );
};

export default StyledCard;
import React from 'react';
import Grid from '@mui/material/Grid';

// This component automatically converts old Grid props to new ones
const GridWrapper = ({ children, item, xs, sm, md, lg, xl, ...props }) => {
  // Convert old props to new size object
  const size = {};
  if (xs !== undefined) size.xs = xs;
  if (sm !== undefined) size.sm = sm;
  if (md !== undefined) size.md = md;
  if (lg !== undefined) size.lg = lg;
  if (xl !== undefined) size.xl = xl;
  
  return (
    <Grid {...props} size={Object.keys(size).length > 0 ? size : undefined}>
      {children}
    </Grid>
  );
};

export default GridWrapper;
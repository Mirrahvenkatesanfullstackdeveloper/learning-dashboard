import React from 'react';
import { Box, Pagination as MuiPagination, PaginationItem } from '@mui/material';
import { Link } from 'react-router-dom';

const Pagination = ({
  page = 1,
  count = 1,
  onChange,
  color = 'primary',
  size = 'medium',
  shape = 'rounded',
  showFirstButton = true,
  showLastButton = true,
  siblingCount = 1,
  boundaryCount = 1,
}) => {
  const handleChange = (event, value) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
      <MuiPagination
        page={page}
        count={count}
        onChange={handleChange}
        color={color}
        size={size}
        shape={shape}
        showFirstButton={showFirstButton}
        showLastButton={showLastButton}
        siblingCount={siblingCount}
        boundaryCount={boundaryCount}
        renderItem={(item) => (
          <PaginationItem
            component={item.page ? Link : 'span'}
            to={`?page=${item.page}`}
            {...item}
          />
        )}
      />
    </Box>
  );
};

export default Pagination;
import React, { useState, useEffect } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Chip,
  Popper,
  Grow,
  ClickAwayListener,
  MenuItem,
  MenuList,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBar = ({ onSearch, placeholder = 'Search...', filters = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    onSearch({ term: debouncedSearchTerm, filters: selectedFilters });
  }, [debouncedSearchTerm, selectedFilters, onSearch]);

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenFilters(!openFilters);
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilters(prev =>
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedFilters([]);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #E2E8F0',
        borderRadius: 2,
        '&:hover': {
          borderColor: '#667eea',
        },
      }}
    >
      <SearchIcon sx={{ ml: 1, color: 'text.secondary' }} />
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <IconButton size="small" onClick={handleClear}>
          <ClearIcon fontSize="small" />
        </IconButton>
      )}
      {filters.length > 0 && (
        <>
          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24 }} />
          <IconButton 
            onClick={handleFilterClick}
            color={selectedFilters.length ? 'primary' : 'default'}
          >
            <FilterListIcon />
          </IconButton>
        </>
      )}
      
      <Popper
        open={openFilters}
        anchorEl={anchorEl}
        transition
        placement="bottom-end"
        style={{ zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper sx={{ mt: 1, minWidth: 200 }}>
              <ClickAwayListener onClickAway={() => setOpenFilters(false)}>
                <MenuList>
                  {filters.map((filter) => (
                    <MenuItem 
                      key={filter.value}
                      onClick={() => handleFilterSelect(filter.value)}
                      selected={selectedFilters.includes(filter.value)}
                    >
                      {filter.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      {selectedFilters.length > 0 && (
        <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
          {selectedFilters.map(filter => (
            <Chip
              key={filter}
              label={filter}
              size="small"
              onDelete={() => handleFilterSelect(filter)}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default SearchBar;
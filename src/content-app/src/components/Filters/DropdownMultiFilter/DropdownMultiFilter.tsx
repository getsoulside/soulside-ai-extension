import Loader from "@/components/Loader";
import Search from "@/components/Search";
import { ClearAllRounded } from "@mui/icons-material";
import {
  Badge,
  badgeClasses,
  Box,
  Checkbox,
  IconButton,
  MenuItem,
  MenuList,
  Select,
  SxProps,
  Theme,
  Tooltip,
} from "@mui/material";
import React, { useMemo, useRef } from "react";

interface DropdownFilterProps {
  options: (string | Record<string, any>)[];
  selectedValues: string[] | Record<string, any>[] | [];
  keyLabel?: string;
  valueLabel?: string;
  onSelect: (values: any) => void;
  dropdownLabel?: string;
  optionRenderer?: (value: string | any | null) => React.ReactNode;
  loading?: boolean;
  noDataText?: string;
  searchContexts?: (string | ((option: any) => string))[];
  limitListLength?: number;
  sx?: SxProps<Theme>;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  options,
  selectedValues,
  keyLabel = "key",
  valueLabel = "value",
  dropdownLabel = "Select Filter",
  onSelect,
  optionRenderer,
  loading = false,
  noDataText = "No data",
  searchContexts = [],
  limitListLength,
  sx,
}): React.ReactNode => {
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filteredOptions = useMemo(() => {
    let data: (string | Record<string, any>)[] = options;
    if (searchTerm) {
      data = options.filter(option => {
        if (typeof option === "string") {
          return option.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return searchContexts?.some(context => {
          if (typeof context === "function") {
            return context(option).toLowerCase().includes(searchTerm.toLowerCase());
          }
          return option[context]?.toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }
    if (limitListLength) {
      data = data.slice(0, limitListLength);
    }
    return data;
  }, [searchTerm, options, searchContexts, limitListLength]);
  const onFilterSelect = (option: string | Record<string, any>) => {
    if (typeof option === "string") {
      if (selectedValues.includes(option as never)) {
        onSelect(selectedValues.filter(value => value !== option));
      } else {
        onSelect([...selectedValues, option]);
      }
    } else {
      if (
        selectedValues.some((selectedValue: any) => selectedValue[keyLabel] === option[keyLabel])
      ) {
        onSelect(
          selectedValues.filter(value => {
            if (typeof value === "object" && value !== null) {
              return value[keyLabel] !== option[keyLabel];
            }
            return true;
          })
        );
      } else {
        onSelect([...selectedValues, option]);
      }
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (document.activeElement === searchInputRef.current) {
      // Prevent default keyboard navigation when search input is focused
      event.stopPropagation();
    }
  };
  return (
    <Badge
      badgeContent={selectedValues.length}
      sx={theme => ({
        [`& .${badgeClasses.badge}`]: {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
        },
      })}
    >
      <Select
        id={`dropdownMultiFilter-${dropdownLabel}`}
        multiple={true}
        displayEmpty
        inputProps={{ "aria-label": dropdownLabel }}
        renderValue={() => {
          return dropdownLabel;
        }}
        value={selectedValues}
        MenuProps={{
          autoFocus: false,
        }}
        sx={sx}
      >
        <Box
          sx={{
            mt: 0.5,
            mb: 1,
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onKeyDown={handleKeyDown}
        >
          <Search
            searchRef={searchInputRef}
            onSearch={setSearchTerm}
            placeholder={"Search"}
            autoFocus
          />
          {selectedValues.length > 0 && (
            <Tooltip title="Clear All">
              <IconButton onClick={() => onSelect([])}>
                <ClearAllRounded />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <MenuList
          sx={{
            maxHeight: 300,
            minHeight: loading ? 100 : 0,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            padding: 0,
            outline: "none",
            flex: 1,
            overflowY: "auto",
          }}
        >
          <Loader
            loading={loading}
            size="small"
          >
            {filteredOptions.map(option => {
              const key = typeof option === "string" ? option : option[keyLabel];
              const value = typeof option === "string" ? option : option[valueLabel];
              let isSelected = false;
              if (typeof option === "string") {
                isSelected = selectedValues.includes(option as never);
              } else {
                isSelected = selectedValues.some(
                  (selectedValue: any) => selectedValue[keyLabel] === key
                );
              }
              return (
                <MenuItem
                  key={key}
                  value={key}
                  onClick={() => onFilterSelect(option)}
                  sx={{ display: "flex", gap: 1, alignItems: "center" }}
                >
                  <Checkbox
                    checked={isSelected}
                    sx={{ m: 0 }}
                  />
                  {optionRenderer ? optionRenderer(option) : value}
                </MenuItem>
              );
            })}
            {filteredOptions.length === 0 && (
              <MenuItem
                value=""
                disabled
                sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                {noDataText}
              </MenuItem>
            )}
          </Loader>
        </MenuList>
      </Select>
    </Badge>
  );
};

export default DropdownFilter;

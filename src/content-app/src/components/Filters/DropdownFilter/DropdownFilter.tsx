import Loader from "@/components/Loader";
import Search from "@/components/Search";
import { ClearAllRounded } from "@mui/icons-material";
import { Box, IconButton, MenuItem, MenuList, Select, SxProps, Tooltip } from "@mui/material";
import React, { useMemo, useRef } from "react";

interface DropdownFilterProps {
  options: (string | Record<string, any>)[];
  selectedValue: string | Record<string, any> | null;
  keyLabel?: string;
  valueLabel?: string;
  onSelect: (value: any) => void;
  dropdownLabel?: string;
  titleRenderer?: (value: string | any | null) => React.ReactNode;
  optionRenderer?: (value: string | any | null) => React.ReactNode;
  loading?: boolean;
  noDataText?: string;
  searchContexts?: (string | ((option: any) => string))[];
  limitListLength?: number;
  sx?: SxProps;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  options,
  selectedValue,
  keyLabel = "key",
  valueLabel = "value",
  dropdownLabel = "Select Filter",
  onSelect,
  titleRenderer,
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
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (document.activeElement === searchInputRef.current) {
      // Prevent default keyboard navigation when search input is focused
      event.stopPropagation();
    }
  };
  return (
    <Select
      id={`dropdownFilter-${dropdownLabel}`}
      displayEmpty
      inputProps={{ "aria-label": dropdownLabel }}
      renderValue={() => {
        const selected =
          options.find(option =>
            typeof option === "string"
              ? option === selectedValue
              : selectedValue &&
                typeof option !== "string" &&
                typeof selectedValue !== "string" &&
                option[keyLabel] === selectedValue[keyLabel]
          ) || null;
        if (!selected) {
          return dropdownLabel;
        }
        if (titleRenderer) {
          return titleRenderer(selected);
        }
        return typeof selected === "string" ? selected : selected[valueLabel];
      }}
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
        {!!selectedValue && (
          <Tooltip title="Clear All">
            <IconButton onClick={() => onSelect(null)}>
              <ClearAllRounded />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <MenuList
        sx={{
          maxHeight: 250,
          minHeight: loading ? 100 : 0,
          display: "flex",
          flexDirection: "column",
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
            const isSelected =
              typeof selectedValue === "string"
                ? selectedValue === key
                : selectedValue
                ? selectedValue[keyLabel] === key
                : false;
            return (
              <MenuItem
                key={key}
                value={key}
                selected={isSelected}
                onClick={() => onSelect(option)}
              >
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
  );
};

export default DropdownFilter;

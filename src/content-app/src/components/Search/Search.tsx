import React, { useEffect } from "react";
import { FormControl, InputAdornment, OutlinedInput, useTheme } from "@mui/material";
import { SearchRounded } from "@mui/icons-material";

interface SearchProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  noDebounce?: boolean;
  autoFocus?: boolean;
  searchRef?: React.RefObject<HTMLInputElement>;
}

const Search: React.FC<SearchProps> = ({
  onSearch,
  placeholder = "Search",
  noDebounce = false,
  autoFocus = false,
  searchRef,
}): React.ReactNode => {
  const [value, setValue] = React.useState<string>("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  useEffect(() => {
    const handler = setTimeout(
      () => {
        onSearch(value);
      },
      !noDebounce ? 300 : 0
    );

    return () => {
      clearTimeout(handler);
    };
  }, [value, onSearch]);
  const theme = useTheme();
  return (
    <FormControl
      sx={{ width: { xs: "100%", md: "100%" } }}
      variant="outlined"
    >
      <OutlinedInput
        value={value}
        onChange={onChange}
        size="medium"
        placeholder={placeholder}
        sx={{ flexGrow: 1 }}
        autoFocus={autoFocus}
        startAdornment={
          <InputAdornment
            position="start"
            sx={{ color: "text.primary" }}
          >
            <SearchRounded sx={{ color: theme.palette.grey[400], fontSize: "1.3rem" }} />
          </InputAdornment>
        }
        inputProps={{
          "aria-label": "search",
          ref: searchRef,
        }}
      />
    </FormControl>
  );
};

export default Search;

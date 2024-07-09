import { Input, InputAdornment, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useRef, useState } from "react";

type InputProps = {
  onValueChange: (value: string) => void;
  placeholder?: string;
  getMessage?: Function;
  trigger?: boolean;
};

export const InputSearch = ({
  onValueChange,
  placeholder,
  getMessage,
  trigger,
  ...props
}: InputProps) => {
  const theme = useTheme();
  const timer = useRef<NodeJS.Timeout>();
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (trigger === undefined) return;

    setValue("");
  }, [trigger]);

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      onValueChange(value);
    }, 500);
    return () => clearTimeout(timer.current);
  }, [value]);

  const handleChange = (value: string) => {
    setValue(value);
  };

  return (
    <Input
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon sx={{ color: theme.palette.grey[900] }} />
        </InputAdornment>
      }
      inputProps={{
        maxLength: 100,
      }}
      autoFocus
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={placeholder || "Search..."}
      disableUnderline={true}
      sx={{
        color: theme.palette.action.disabledBackground,
        "&::placeholder": {
          color: theme.palette.action.disabledBackground,
        },
        border: "1px solid",
        borderColor: theme.palette.grey[300],
        borderRadius: "4px",
        backgroundColor: theme.palette.grey[400],
        width: 261,
        padding: "8px 10px",
      }}
      {...props}
    />
  );
};

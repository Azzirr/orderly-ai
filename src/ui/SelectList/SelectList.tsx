import React from "react";
import { MenuItem, Select, OutlinedInput, FormControl, SelectChangeEvent } from "@mui/material";
interface SelectListProps {
 field: {
  name: string;
  value: any;
  onChange: (event: SelectChangeEvent<any>, child: React.ReactNode) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
 };
 name: string;
 items: string[];
}

export const SelectList: React.FC<SelectListProps> = ({ field, name, items }) => {
 return (
  <FormControl fullWidth variant="outlined">
   <Select
    sx={(theme) => ({
     borderRadius: "10px",
     height: "36px",
     backgroundColor: theme.palette.info.main,
     whiteSpace: "nowrap",
     overflow: "hidden",
     textOverflow: "ellipsis",
     width: "100%",
    })}
    {...field}
    value={field.value || ""}
    input={<OutlinedInput label={name} />}>
    {items.map((item) => (
     <MenuItem value={item} key={item}>
      {item}
     </MenuItem>
    ))}
   </Select>
  </FormControl>
 );
};

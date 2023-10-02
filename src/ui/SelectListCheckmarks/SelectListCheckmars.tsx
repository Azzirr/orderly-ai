import React from "react";
import { Checkbox, MenuItem, Select, OutlinedInput, FormControl } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
interface SelectListCheckmarksProps {
 field: {
  name: string;
  value: any;
  onChange: (event: SelectChangeEvent<string[]>, child: React.ReactNode) => void;
  onBlur: (event: React.FocusEvent<any, Element>) => void;
 };
 name: string;
 items: string[];
}

export const SelectListCheckmarks: React.FC<SelectListCheckmarksProps> = ({ field, name, items }) => {
 const selectedItems = field.value || [];

 const handleCheckboxToggle = (item: string) => {
  const updatedItems = selectedItems.includes(item) ? selectedItems.filter((selected: string) => selected !== item) : [...selectedItems, item];

  field.onChange({ target: { name: field.name, value: updatedItems } } as SelectChangeEvent<string[]>, field.name);
 };

 return (
  <FormControl fullWidth variant="outlined">
   <Select
    sx={(theme) => ({ borderRadius: "10px", height: "36px", backgroundColor: theme.palette.info.main, width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" })}
    {...field}
    value={selectedItems}
    multiple
    input={<OutlinedInput label={name} />}
    renderValue={(selected) => (selected as string[]).join(", ")}>
    {items.map((item) => (
     <MenuItem key={item} value={item}>
      <Checkbox checked={selectedItems.includes(item)} onChange={() => handleCheckboxToggle(item)} />
      {item}
     </MenuItem>
    ))}
   </Select>
  </FormControl>
 );
};

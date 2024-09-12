import { ChangeEvent, ReactNode } from "react";
import classes from "./Dropdown.module.css";

interface DropdownProps {
  value: string;
  selectItems: string[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  defaultOption: ReactNode;
}

function Dropdown({
  value,
  selectItems,
  onChange,
  defaultOption,
}: DropdownProps) {
  return (
    <select className={classes.Dropdown} value={value} onChange={onChange}>
      {defaultOption}
      {selectItems.map((singleItem) => (
        <option key={singleItem} value={singleItem}>
          {singleItem}
        </option>
      ))}
    </select>
  );
}

export default Dropdown;

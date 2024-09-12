import { ChangeEvent } from "react";
import classes from "./AmountInput.module.css";

interface AmountInputProps {
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function AmountInput({ placeholder, value, onChange }: AmountInputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={classes.AmountInput}
    />
  );
}

export default AmountInput;

// manual way of rounding the value to decimal - I have updated some solution I found externally with a precision fix for very small numbers
export default function roundToDecimal(value: number): number {
  // default precision is 2 decimal places
  let precision: number = 2;

  // check and fix precision for very small values
  if (value < 1) {
    const stringValue = value.toString();

    const numbersAfterDot = stringValue.split(".")[1];

    for (let i = 0; i < numbersAfterDot.length; i++) {
      if (numbersAfterDot[i] !== "0") {
        precision = i + 1;
        break;
      }
    }

    if (numbersAfterDot[precision]) {
      precision = precision + 1;
    }
  }
  const multiplier = Math.pow(10, precision);
  const roundedValue = Math.round(value * multiplier) / multiplier;

  return roundedValue;
}

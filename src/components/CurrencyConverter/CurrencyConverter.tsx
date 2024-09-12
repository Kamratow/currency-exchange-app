import { ChangeEvent, useState } from "react";
import classes from "./CurrencyConverter.module.css";
import AmountInput from "../AmountInput/AmountInput";
import useCurrencyList from "../../hooks/useCurrencyList";
import Dropdown from "../Dropdown/Dropdown";
import useConvertCurrency from "../../hooks/useConvertCurrency";

// I guess this one we might consider moving for example to Dropdown component directory
function DefaultSelectOption({ label }: { label: string }) {
  return (
    <option key="default" value="default">
      {label}
    </option>
  );
}

function CurrencyConverter() {
  const [amountToConvert, setAmountToConvert] = useState<string>("1");
  const [currencyFrom, setCurrencyFrom] = useState<string>("default");
  const [currencyTo, setCurrencyTo] = useState<string>("default");

  const {
    currenciesList,
    isFetchingCurrencyList,
    isErrorForFetchingCurrencyList,
  } = useCurrencyList();

  const { convertedAmount, isErrorForConvertingAmount } = useConvertCurrency({
    currencyFrom,
    currencyTo,
    amountToConvert,
  });

  const isEverythingFilledInForConversion =
    amountToConvert !== "" &&
    currencyFrom !== "default" &&
    currencyTo !== "default";

  const handleValueToConvertChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValueToConvert = event.target.value;

    if (
      !newValueToConvert.match(/^[1-9][0-9]{0,6}$/) &&
      newValueToConvert !== ""
    ) {
      return;
    }

    setAmountToConvert(newValueToConvert);
  };

  const handleCurrencyFromChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrencyFrom(event.target.value);
  };

  const handleCurrencyToChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrencyTo(event.target.value);
  };

  if (isFetchingCurrencyList) {
    return <p>Initializing Currency Converter...</p>;
  }

  if (isErrorForFetchingCurrencyList) {
    return (
      <p>
        Something went wrong when initializing Currency Converter. Please
        refresh the page and try again.
      </p>
    );
  }

  return (
    <div className={classes.CurrencyConverterWrapper}>
      <h1>Currency converter</h1>
      <p>Input the ammount you want to convert and the currency from and to</p>
      <p>
        Please be aware that amount should be a full number between 1 and
        9999999.
      </p>
      <div>
        <AmountInput
          placeholder="Amount to convert"
          value={amountToConvert}
          onChange={handleValueToConvertChange}
        />
      </div>
      <div className={classes.RowWrapper}>
        <div className={classes.RowItemWrapper}>
          <Dropdown
            value={currencyFrom}
            onChange={handleCurrencyFromChange}
            selectItems={currenciesList}
            defaultOption={<DefaultSelectOption label="From currency" />}
          />
        </div>
        <div className={classes.RowItemWrapper}>
          <Dropdown
            value={currencyTo}
            onChange={handleCurrencyToChange}
            selectItems={currenciesList}
            defaultOption={<DefaultSelectOption label="To currency" />}
          />
        </div>
      </div>
      {isEverythingFilledInForConversion && !isErrorForConvertingAmount && (
        <p>
          {amountToConvert} {currencyFrom} = {convertedAmount} {currencyTo}
        </p>
      )}

      {!isEverythingFilledInForConversion && !isErrorForConvertingAmount && (
        <p>Fill in all the values to see the result</p>
      )}

      {isErrorForConvertingAmount && (
        <p>Something went wrong when converting currency. Please try again.</p>
      )}
    </div>
  );
}

export default CurrencyConverter;

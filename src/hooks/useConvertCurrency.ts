import { useEffect, useState } from "react";
import roundToDecimal from "../helpers/roundToDecimal";

interface ConvertEndpointResponse {
  response: {
    value: number;
  };
}

interface UseConvertCurrencyParams {
  currencyFrom: string;
  currencyTo: string;
  amountToConvert: string;
}

interface UseConvertCurrencyReturn {
  convertedAmount: string | null;
  isErrorForConvertingAmount: boolean;
  lastConvertedValues: LastConvertedValues[];
}

interface LastConvertedValues {
  from: string;
  to: string;
  amountFrom: string;
  amountTo: string;
}

// looks like the convert endpoint is pretty past so I haven't exposed the pending status from the hook but this can be changed in the future
// also in case of multiple request being done in the same time we might consider adding some debounce to wait for the user to finish typing
export default function useConvertCurrency({
  currencyFrom,
  currencyTo,
  amountToConvert,
}: UseConvertCurrencyParams): UseConvertCurrencyReturn {
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null);
  const [isErrorForConvertingAmount, setIsErrorForConvertingAmount] =
    useState<boolean>(false);
  const [lastConvertedValues, setLastConvertedValues] = useState<
    LastConvertedValues[]
  >([]);

  useEffect(() => {
    // this is how for example we can use config from env file to set history length
    // after chaging history length in .env we need to redeploy the app
    // we are converting here the value from config to number using + sign
    const historyLength = +import.meta.env.VITE_CONVERSION_HISTORY_LENGTH;
    const currencyBeaconApiKey = import.meta.env.VITE_CURRENCY_BEACON_API_KEY;
    const convertApiUrl = import.meta.env
      .VITE_CURRENCY_BEACON_API_CONVERT_ENDPOINT;
    const convertUrlWithParams =
      convertApiUrl +
      "?api_key=" +
      currencyBeaconApiKey +
      "&from=" +
      currencyFrom +
      "&" +
      "to=" +
      currencyTo +
      "&amount=" +
      amountToConvert;

    setIsErrorForConvertingAmount(false);

    const fetchConvertedValue = async () => {
      try {
        const response = await fetch(convertUrlWithParams);

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json: ConvertEndpointResponse = await response.json();

        const newConvertedValue = roundToDecimal(
          json.response.value
        ).toString();

        setConvertedAmount(newConvertedValue);
        setLastConvertedValues((prevState) => {
          const newConvertedValues = [...prevState];

          newConvertedValues.unshift({
            from: currencyFrom,
            to: currencyTo,
            amountFrom: amountToConvert,
            // here we had casting to string before but I spotted we don't need it anymore after latest round of refactoring during technical interview
            amountTo: newConvertedValue,
          });

          if (newConvertedValues.length > historyLength) {
            newConvertedValues.pop();
          }

          return newConvertedValues;
        });
      } catch (error) {
        console.log(error);
        setIsErrorForConvertingAmount(true);
      }
    };

    if (
      amountToConvert !== "" &&
      currencyFrom !== "default" &&
      currencyTo !== "default" &&
      currencyFrom !== currencyTo
    ) {
      fetchConvertedValue();
    }

    if (currencyFrom === currencyTo) {
      setConvertedAmount(amountToConvert);
    }

    if (amountToConvert === "") {
      setConvertedAmount(amountToConvert);
    }
  }, [currencyFrom, currencyTo, amountToConvert]);

  return {
    convertedAmount,
    isErrorForConvertingAmount,
    lastConvertedValues,
  };
}

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

  useEffect(() => {
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

        setConvertedAmount(roundToDecimal(json.response.value).toString());
      } catch (error) {
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

    if (amountToConvert == "") {
      setConvertedAmount(amountToConvert);
    }
  }, [currencyFrom, currencyTo, amountToConvert]);

  return {
    convertedAmount,
    isErrorForConvertingAmount,
  };
}

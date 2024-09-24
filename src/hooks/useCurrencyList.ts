import { useEffect, useState } from "react";

interface CurrencyResponseItem {
  short_code: string;
}

// ideally we could get some typing generated from the API itself, if not we can keep on manually expanding types for responses
interface CurrenciesEndpointResponse {
  response: CurrencyResponseItem[];
}

interface UseCurrencyListReturn {
  currenciesList: string[];
  isErrorForFetchingCurrencyList: boolean;
  isFetchingCurrencyList: boolean;
}

export default function useCurrencyList(): UseCurrencyListReturn {
  const [currenciesList, setCurrenciesList] = useState<string[]>([]);
  const [isFetchingCurrencyList, setIsFetchingCurrencyList] =
    useState<boolean>(true);
  const [isErrorForFetchingCurrencyList, setIsErrorForFetchingCurrencyList] =
    useState<boolean>(false);

  useEffect(() => {
    const currencyBeaconApiKey = import.meta.env.VITE_CURRENCY_BEACON_API_KEY;
    const currenciesApiUrl = import.meta.env
      .VITE_CURRENCY_BEACON_API_CURRENCIES_ENDPOINT;
    const currenciesUrlWithParams =
      currenciesApiUrl + "?api_key=" + currencyBeaconApiKey + "&type=fiat";

    const fetchCurrencies = async () => {
      try {
        const response = await fetch(currenciesUrlWithParams);

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json: CurrenciesEndpointResponse = await response.json();

        const currenciesShortCodeList = json.response.map(
          (singleCurrency) => singleCurrency.short_code
        );
        setCurrenciesList(currenciesShortCodeList);
      } catch (error) {
        console.log(error);
        setIsErrorForFetchingCurrencyList(true);
      } finally {
        setIsFetchingCurrencyList(false);
      }
    };
    fetchCurrencies();
  }, []);

  return {
    currenciesList,
    isErrorForFetchingCurrencyList,
    isFetchingCurrencyList,
  };
}

# currency-exchange-app

## How to run the app

For running the app you will need to have a `.env` file with currency API key and endpoints in your project directory.
Endpoint URLs had been put there as we might have different API urls for different environments - from dev through test until the production. This way we only need to change the url endpoint in `.env` when deploying app to different environments.
The API_KEY shouldn't be exposed evend in `.env` file - ideally I would suggest to create even some small middleware backend that would allow to store the API KEY on the server side (instead of current situation where it's on the client side).
I will pack the `.env` file in the zip with solution but it has been added to `.gitignore` so that we wouldn't commit it accidentally to the repository.
Example of the `.env` file:

```
VITE_CURRENCY_BEACON_API_KEY="your_api_key_goes_here"
VITE_CURRENCY_BEACON_API_CURRENCIES_ENDPOINT="endpoint_url_goes_here"
VITE_CURRENCY_BEACON_API_CONVERT_ENDPOINT="endpoint_url_goes_here"
```

When extending `.env` file remember to add `VITE_` as the first piece of new variable name as without this it won't work in Vite.

Before running the app you also need to install dependencies with this command:

```
npm install
```

When you have all the prerequisites from above ready you can run the app using this command:

```
npm run dev
```

### Multiple activation of hooks when in dev mode

When app is run in dev mode you can experience multiple activation of hooks even though for example `useEffect` could have nothing in dependencies array.
This is caused by `StrictMode` component used in `main.tsx` file - in order to fix this just comment out or temporarily remove `StrictMode` from main.tsx.

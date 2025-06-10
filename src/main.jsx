import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./i18n";
import { Provider } from "react-redux";
import store from "./app/store.js";
import { QueryProvider } from "./components/providers/query-provider.jsx";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <QueryProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </QueryProvider>
    </QueryClientProvider>
  </Provider>
);

import "@/app.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { AppProvider } from "./app/providers/AppProvider";

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <AppProvider />
    </StrictMode>,
  );
}

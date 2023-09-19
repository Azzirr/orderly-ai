import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./Theme/ThemeProvider.ts";
import { UserContextProvider } from "./Context/userContext/UserContextProvider.tsx";
import { CategoryContextProvider } from "./Context/categoryContext/CategoryContextProvider.tsx";
import { ItemContextProvider } from "./Context/itemContext/ItemContextProvider.tsx";
import { VariableContextProvider } from "./Context/variableContext/VariableContextProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
 <React.StrictMode>
  <UserContextProvider>
   <CategoryContextProvider>
    <ItemContextProvider>
     <VariableContextProvider>
      {" "}
      <ThemeProvider theme={theme}>
       <App />
      </ThemeProvider>
     </VariableContextProvider>
    </ItemContextProvider>
   </CategoryContextProvider>
  </UserContextProvider>
 </React.StrictMode>,
);

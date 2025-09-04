// src/main.jsx
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import { lightTheme } from "./themes";

function Root() {
  const [theme, setTheme] = useState(lightTheme);

  return (
    <ChakraProvider theme={theme}>
      <App setTheme={setTheme} />
    </ChakraProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);

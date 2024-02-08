import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { PrimeReactProvider } from "primereact/api";
import "primeicons/primeicons.css";
import Tailwind from "primereact/passthrough/tailwind";
import { ChakraProvider } from "@chakra-ui/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";


const theme = createTheme();




        



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ChakraProvider>
        <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
          <App />
        </PrimeReactProvider>
      </ChakraProvider>
    </ThemeProvider>
  </React.StrictMode>
);

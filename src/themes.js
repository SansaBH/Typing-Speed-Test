// src/themes.js
import { extendTheme } from "@chakra-ui/react";

export const lightTheme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "black",
      },
    },
  },
});

export const darkTheme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: "gray.900",
        color: "white",
      },
    },
  },
});

export const funTheme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: "pink.100",
        color: "purple.800",
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
      },
    },
  },
});

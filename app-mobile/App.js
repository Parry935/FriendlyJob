import * as React from "react";
import { NativeBaseProvider } from "native-base";
import AppProvider from "./providers/AppProvider";
import Main from "./Main";

export default function App() {
  return (
    <AppProvider>
      <NativeBaseProvider>
        <Main />
      </NativeBaseProvider>
    </AppProvider>
  );
}

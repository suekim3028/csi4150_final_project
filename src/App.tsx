import React from "react";
import "./App.css";
import TitlePage from "./components/TitlePage";
import ScrollContextProvider from "./contexts/ScrollContext";

function App() {
  return (
    <ScrollContextProvider>
      <TitlePage />
      <TitlePage />
    </ScrollContextProvider>
  );
}
export default App;

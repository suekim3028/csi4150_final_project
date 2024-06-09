import React from "react";
import "./App.css";
import ChildTermPage from "./components/ChildTermPage";
import TitlePage from "./components/TitlePage";
import ScrollContextProvider from "./contexts/ScrollContext";

function App() {
  return (
    <ScrollContextProvider>
      <TitlePage />
      <ChildTermPage />
    </ScrollContextProvider>
  );
}
export default App;

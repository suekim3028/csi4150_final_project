import React from "react";
import "./App.css";
import AlonePage from "./components/AlonePage";
import BarRacePage from "./components/BarRacePage";
import BricksPage from "./components/BricksPage";
import ChildTermPage from "./components/ChildTermPage";
import CompareCountriesPage from "./components/CompareCountriesPage";
import EffectPage from "./components/EffectPage";
import KoreaMapPage from "./components/KoreaMapPage";
import OldTermPage from "./components/OldTermPage";
import TitlePage from "./components/TitlePage";
import ScrollContextProvider from "./contexts/ScrollContext";

function App() {
  return (
    <ScrollContextProvider>
      <TitlePage />
      <ChildTermPage />
      <OldTermPage />
      <BricksPage />
      <CompareCountriesPage />
      <BarRacePage />
      <KoreaMapPage />
      <EffectPage />
      <AlonePage />
    </ScrollContextProvider>
  );
}
export default App;

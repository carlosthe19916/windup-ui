import React from "react";
import { HashRouter } from "react-router-dom";

import { AppRoutes } from "./Routes";
import "./App.css";

import { DefaultLayout } from "./layout";

const App: React.FC = () => {
  return (
    <HashRouter>
      <DefaultLayout>
        <AppRoutes />
      </DefaultLayout>
    </HashRouter>
  );
};

export default App;

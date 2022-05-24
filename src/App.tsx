import React, { useEffect } from "react";
import { HashRouter } from "react-router-dom";

import { AppRoutes } from "./Routes";
import "./App.css";

import { DefaultLayout } from "./layout";
import { Theme } from "layout/theme-constants";

const App: React.FC = () => {
  useEffect(() => {
    document.title = Theme.name;

    const favicon: any = document.querySelector("link[name='favicon']");
    if (favicon && Theme.faviconSrc) {
      favicon.href = Theme.faviconSrc;
    }
  }, []);

  return (
    <HashRouter>
      <DefaultLayout>
        <AppRoutes />
      </DefaultLayout>
    </HashRouter>
  );
};

export default App;

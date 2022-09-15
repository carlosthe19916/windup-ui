import React, { useEffect } from "react";
import { HashRouter } from "react-router-dom";

import { AppRoutes } from "./Routes";
import "./App.css";

import { DefaultLayout } from "./layout";
import { Theme } from "layout/theme-constants";
import { useApplicationsQuery } from "queries/applications";

import { ProcessedQueriesContextProvider } from "context/processed-queries-context";
import { SimpleContextProvider } from "context/simple-context";

const App: React.FC = () => {
  const applications = useApplicationsQuery();

  useEffect(() => {
    document.title = Theme.name;

    const favicon: any = document.querySelector("link[name='favicon']");
    if (favicon && Theme.faviconSrc) {
      favicon.href = Theme.faviconSrc;
    }
  }, []);

  return (
    <HashRouter>
      <ProcessedQueriesContextProvider>
        <SimpleContextProvider
          allContexts={(applications.data || [])
            .map((e) => ({
              key: e.id,
              label: e.name,
            }))
            .concat({ key: "", label: "All applications" })}
        >
          <DefaultLayout>
            <AppRoutes />
          </DefaultLayout>
        </SimpleContextProvider>
      </ProcessedQueriesContextProvider>
    </HashRouter>
  );
};

export default App;

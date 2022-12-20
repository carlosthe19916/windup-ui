import "./App.css";import React, { useEffect } from "react";
import { HashRouter } from "react-router-dom";

import { ProcessedQueriesContextProvider } from "@app/context/processed-queries-context";
import { SimpleContextProvider } from "@app/context/simple-context";
import { Theme } from "@app/layout/theme-constants";
import { useApplicationsQuery } from "@app/queries/applications";

import { DefaultLayout } from "./layout";
import { AppRoutes } from "./Routes";

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

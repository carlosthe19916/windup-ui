import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const ApplicationList = lazy(() => import("./pages/application-list"));
const IssuesList = lazy(() => import("./pages/issues-list"));

export type ApplicationRoute = {
  applicationId: string;
};

export const AppRoutes = () => {
  const routes = [
    {
      Component: ApplicationList,
      path: "/",
      hasDescendant: false,
    },
    {
      Component: IssuesList,
      path: "/issues",
      hasDescendant: false,
    },
    {
      Component: IssuesList,
      path: "/issues/applications",
      hasDescendant: false,
    },
    {
      Component: IssuesList,
      path: "/issues/applications/:applicationId",
      hasDescendant: false,
    },
  ];

  return (
    <Suspense fallback={<span>Loading...</span>}>
      <Routes>
        {routes.map(({ path, hasDescendant, Component }, index) => (
          <Route
            key={index}
            path={!hasDescendant ? path : `${path}/*`}
            element={<Component />}
          />
        ))}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

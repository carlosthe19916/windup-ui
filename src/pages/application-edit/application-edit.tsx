import { useMemo } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useMatch,
  useNavigate,
} from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
  Tab,
  Tabs,
  TabTitleText,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { useApplicationsQuery } from "queries/applications";

export const ApplicationEdit: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const routeParams = useMatch("/applications/:applicationId/*");

  const applicationsQuery = useApplicationsQuery();
  const application = useMemo(() => {
    const applicationId = routeParams?.params.applicationId;
    return (
      applicationsQuery.data?.find((app) => app.id === applicationId) || null
    );
  }, [routeParams?.params, applicationsQuery.data]);

  const tabItems: { title: string; path: string }[] = [
    {
      title: "Issues",
      path: `/applications/${application?.id}/issues`,
    },
    {
      title: "Technologies",
      path: `/applications/${application?.id}/technologies`,
    },
    {
      title: "Dependencies",
      path: `/applications/${application?.id}/dependencies`,
    },
    {
      title: "Ignored files",
      path: `/applications/${application?.id}/ignored-files`,
    },
  ];

  return (
    <>
      <PageSection type="breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/applications">Applications</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{application?.name}</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection type="default" variant="light">
        <TextContent>
          <Text component="h1">{application?.name}</Text>
        </TextContent>
      </PageSection>
      <PageSection type="nav" variant="light">
        <Tabs
          activeKey={tabItems.find((e) => e.path === location.pathname)?.path}
          onSelect={(_, tabKey) => navigate(`${tabKey}`)}
        >
          {tabItems.map((e, index) => (
            <Tab
              key={index}
              eventKey={e.path}
              title={<TabTitleText>{e.title}</TabTitleText>}
            />
          ))}
        </Tabs>
      </PageSection>
      <Outlet context={application} />
    </>
  );
};
